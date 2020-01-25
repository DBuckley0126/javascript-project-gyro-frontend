import {CableAdapter} from '../../modules'
import {DesktopGameManager} from '../../modules'

class DesktopPageManager{

  // classInstanceContext = this

  constructor(container){
    this.container = container.querySelector("#desktop-container")
    this.initConnection()
    this.renderIndex()
    this.lastPingFromMobile = null
    this.mobileConnected = false
    this.mobileActive = false
  }

  // Inital render of desktop
  async renderIndex(){
    try {
      await this.initBindingsAndEventListeners()
      await this.renderHTML()
    }catch(error){
      this.failureNotice(error)
    }
  }

  renderHTML(){
    this.container.style.display = "block"
    return Promise.resolve("Finished rendering HTML")
  }

  initBindingsAndEventListeners(){
    // Set DesktopPageManagers attributes to HTML elements
    this.createGameButton = this.container.querySelector("#create-game-button")
    this.alert = this.container.querySelector(".alert")
    this.coordinatesDisplay = this.container.querySelector(".coordinates-display")
    this.joinCodeDisplay = this.container.querySelector("#join-code-display")
    this.mobileConnectedAlert = this.container.querySelector("#mobile-connected-alert")
    this.mobileUnactiveAlert = this.container.querySelector("#mobile-unactive-alert")
    this.fullscreenReqestButton = this.container.querySelector(".fullscreen-request-button")
    this.startGameButton = this.container.querySelector("#start-game-button")

    // Initialise listeners
    this.addCreateGameListener(this.createGameButton)
    this.addStartGameListener(this.startGameButton)

    
    return Promise.resolve("Finished setting bindings and listeners")
  }

  // Listeners
  addCreateGameListener(element){
    element.addEventListener("click", event => {
      this.joinCodeDisplay.style.display = "none"
      let joinCode = Math.floor(10000 + (90000 - 10000) * Math.random());
      this.initGameSubscription(joinCode)
      this.joinCodeDisplay.innerText = joinCode
    })
  }

  addStartGameListener(element){

    element.addEventListener("click", event => {
      if(this.mobileActive){
        // Attempt fullscreen
        const context = this
        async function fullScreenLock(){
          try{
            await context.openFullscreen(context.container)
            console.log("Fullscreen granted")
            if(context.deviceType === "mobile"){
              await screen.orientation.lock("portrait-primary")
              console.log("Mobile screen orientation locked")
            } 
  
          }catch(error){
            context.failureNotice(error)
          }
        }
        fullScreenLock()
        // Start game instance
        this.DesktopGameManager = new DesktopGameManager(this)
        this.initMobileConnectionObserver()
        this.startGameButton.innerText = "Play again"

      } else {
        this.alertNotice({type:"refuse_game", statusText: "Can not start game unless mobile connection active"})
        this.startGameButton.style.display = "none"
        this.startGameButton.innerText = "Start Game"
      }
    })
  }

  // Request fullscreen from browser
  openFullscreen(element) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
      return Promise.resolve("Request fullscreen granted")
    } else if (element.mozRequestFullScreen) { /* Firefox */
      element.mozRequestFullScreen();
      return Promise.resolve("Request fullscreen granted")
    } else if (element.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
      element.webkitRequestFullscreen();
      return Promise.resolve("Request fullscreen granted")
    } else if (element.msRequestFullscreen) { /* IE/Edge */
      element.msRequestFullscreen();
      return Promise.resolve("Request fullscreen granted")
    } else {
      return Promise.reject("Request fullscreen denied")
    }
  }  


  // Create cable connection for consumer(Unique user)
  async initConnection(){
    try{
      await this.attachAdapter() 
    }catch(error){
      this.failureNotice(error)
    }
  }
  
  attachAdapter(){
    let adapter = CableAdapter.instance
    if(adapter){
      this.adapter = adapter
      return Promise.resolve("Finished setting bindings and Listeners")
    } else {
      return Promise.reject("Failed to create Adapter")
    }
  }
  

  // Create subscription from DesktopPageManager's cable using joinCode
  initGameSubscription(joinCode, context = this){
    this.gameCable = this.adapter.cable.subscriptions.create({channel: "GameChannel", join_code: joinCode, mobile: false}, {
      received: function(data){
        context.cableDataHandler(data)
      },
      desktopPing: function(payload){
        console.log("Desktop ping sent")
        this.perform('desktop_ping', payload)
      },
      sendMessage: function(payload){

      },
      sensorDataRelay: function(payload){
        this.perform('sensor_data_relay', payload)
      },
      rejected: function(data){
        let error = {type:"connection_rejected", statusText: `Failed to create game for join code ${joinCode}`}
        this.joinCodeDisplay.style.display = "none"
        context.failureNotice(error)
      }
    })
  }

  // Data handler(switch) for data received from subscription
  cableDataHandler(data){
    switch(data["type"]){
      case "sensor_data_relay":
        this.handleSensorDataRelay(data)
        break

      case "subscribed":
        switch(data["action"]){
          case "game_join_success":
            console.log("mobile joined success")
            this.startGameButton.style.display = "block"
            break
          case "game_create_success":
            console.log("game create success")
            this.createGameButton.innerText = "Remake new game"
            this.joinCodeDisplay.style.display = "block"
            this.initDesktopPingLoop()
            break  
        }
        this.alertNotice({type:"connection_success", statusText: data["body"]["message"]})
        break
    }
  }

  // Handle data relay from cable
  handleSensorDataRelay(data){
    this.lastPingFromMobile = Date.now()
    this.mobileActive = data["body"]["user_active"]
    console.log(data["body"])
    if(this.DesktopGameManager){this.DesktopGameManager.sensorData({x: data["body"]["x"], y: data["body"]["y"]})}else{console.log("Can not send sensorData as no game inisialised")}
  }

  // User notices/warnings
  failureNotice(error = {type:"undefiend", statusText: "Failure Unknown"}){
    console.log(error)
    alert(error.statusText)
  }

  alertNotice(notice = {type:"undefiend", statusText: "Failure Unknown"}){
    console.log(notice)
    this.alert.innerHTML = notice.statusText
  }

  // Broadcasters
  initDesktopPingLoop(){
    setInterval(()=>{this.gameCable.desktopPing({action:"desktop_connection_ping", type:"desktop_ping", body:{active: true}})}, 1000)
  }

  // Connection Observers
  initMobileConnectionObserver(){
    setInterval(()=>{
      // checks if mobile is connected
      if(this.lastPingFromMobile < Date.now()-1500){
        this.mobileConnected = false
        this.mobileConnectedAlert.style.display = "none"
        this.startGameButton.stye.display = "none"
        this.DesktopGameManager.connectionStatus({connection: false, active: false})
      } else {
        this.mobileConnected = true
        this.mobileConnectedAlert.style.display = "block"
        // Checks if user is focused on mobile window
        if(!this.mobileActive){
          this.mobileUnactiveAlert.style.display = "block"
          this.startGameButton.stye.display = "none"
          this.DesktopGameManager.connectionStatus({connection: true, active: false})
        }else{
          this.startGameButton.stye.display = "block"
          this.mobileUnactiveAlert.style.display = "none"
          this.DesktopGameManager.connectionStatus({connection: true, active: true})
        }
      }
    }, 500)
  }
}

export {DesktopPageManager}