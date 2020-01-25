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
    if(window.location.hostname == "localhost"){
      this.appURL = `http://localhost:3000/`
    } else {
      this.appURL = `https://javascript-project-gyro-back.herokuapp.com/`
    }
  }

  // Helper to check response of fetch request
  checkRes(res){
    if(!res.ok){
      throw res
    }
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
    this.cancelGameButton = this.container.querySelector("#desktop-game-cancel-button")
    this.mobileConnectionWarning = this.container.querySelector("#desktop-game-mobile-connection-warning")
    this.mobileUnactiveWarning = this.container.querySelector("#desktop-game-mobile-active-warning")

    // Initialise listeners
    this.addCreateGameListener(this.createGameButton)
    this.addStartGameListener(this.startGameButton)
    this.addCancelGameListener(this.cancelGameButton)

    
    return Promise.resolve("Finished setting bindings and listeners")
  }

  // Listeners
  addCreateGameListener(element){
    element.addEventListener("click", event => {
      if(this.gameCable){this.gameCable.unsubscribed({action:"desktop_unsubscribe_check", type:"unsubscribed", body: {device: "desktop"}})}
      this.joinCodeDisplay.style.display = "none"
      this.cancelGameButton.style.display = "none"
      let joinCode = Math.floor(10000 + (90000 - 10000) * Math.random());
      this.initGameSubscription(joinCode)
      this.joinCodeDisplay.innerText = `Game Join Code: ${joinCode}`
    })
  }

  addStartGameListener(element){

    element.addEventListener("click", event => {
      if(this.mobileActive){
        // Start game instance
        this.gameCable.gameState({action:"start_game", type:"game_state", body: {action: "start_game"}})
        this.DesktopGameManager = new DesktopGameManager(this)
        this.startGameButton.innerText = "Play again"
        
      } else {
        this.alertNotice({type:"refuse_game", statusText: "WARNING: Can not start game unless mobile connection active"})
        this.startGameButton.style.display = "none"
        this.startGameButton.innerText = "Start Game"
      }
    })
  }

  addCancelGameListener(element){
    element.addEventListener("click", event => {
      this.gameCable.cancelGame({action:"desktop_canceled_game", type:"cancel_game", body: {device: "desktop"}})
    })
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
      return Promise.resolve("Finished attaching action cable adapter")
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
        this.perform('desktop_ping', payload)
      },
      sensorDataRelay: function(payload){
        this.perform('sensor_data_relay', payload)
      },
      gameState: function(payload){
        this.perform('game_state', payload)
      },
      rejected: function(data){
        let error = {type:"connection_rejected", statusText: `Failed to create game for join code ${joinCode}`}
        clearInterval(this.desktopPingIntervalID)
        clearInterval(this.obileConnectionObserverIntervalID)
        this.joinCodeDisplay.style.display = "none"
        context.failureNotice(error)
      },
      cancelGame: function(payload){
        this.perform('cancel_game', payload)
      },
      unsubscribed: function(){
        this.unsubscribe()
        // this.perform('unsubscribed', payload)
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
            this.cancelGameButton.style.display = "block"
            this.initDesktopPingLoop()
            this.initMobileConnectionObserver()
            break  
        }
        this.alertNotice({type:"connection_success", statusText: data["body"]["message"]})
        break
      case "cancel_game":
        this.cancelGame(data)
        break
      case "unsubscribed":
        let device = null
        if(data["mobile"]){
          device = "Mobile"
        }else{
          device = "desktop"
        }
        console.log(`${device} has unsubscribed from game channel ${data["channel"]}`)
        if(data["mobile"] == true){
          if(this.gameCable){this.gameCable.cancelGame({action:"desktop_canceled_game_from_mobile_unsubscribe", type:"cancel_game", body: {device: "desktop"}})}
        }
        break      
    }
  }

  // Handle data relay from cable
  handleSensorDataRelay(data){
    this.lastPingFromMobile = Date.now()
    this.mobileActive = data["body"]["user_active"]
    console.log(data["body"])
    if(this.DesktopGameManager){this.DesktopGameManager.sensorData({x: data["body"]["x"], y: data["body"]["y"]})}else{console.log("WARNING: Can not set sensorData as no game inisialised")}
  }

  cancelGame(data){
    // {action:"desktop_unsubscribe", type:"unsubscribed", body: {device: "desktop"}}
    if(this.gameCable){this.gameCable.unsubscribed()}
    if(this.DesktopGameManager){this.DesktopGameManager.destroyAndHideGame()}
    clearInterval(this.desktopPingIntervalID)
    clearInterval(this.mobileConnectionObserverIntervalID)
    this.mobileConnected = false
    this.mobileConnectedAlert.style.display = "none"
    this.startGameButton.style.display = "none"
    this.cancelGameButton.style.display = "none"
    this.joinCodeDisplay.style.display = "none"
    this.createGameButton.innerText = "Create New Game"
    this.alertNotice({type:"cancel_game", statusText: `${data["body"]["device"]} has canceled the game`})
  }

  // User notices/warnings
  failureNotice(error = {type:"undefiend", statusText: "Failure Unknown"}){
    console.log(error)
    alert(error.statusText)
  }

  alertNotice(notice = {type:"undefiend", statusText: "Failure Unknown"}){
    clearTimeout(this.alertTimeoutID)
    this.alert.style.display = "block"
    this.alert.innerHTML = notice.statusText
    console.log(notice)
    this.alertTimeoutID = setTimeout(function(){
      this.alert.innerHTML = ""
      this.alert.style.display = "none"
    }.bind(this), 4000)

  }

  // Broadcasters
  initDesktopPingLoop(){
    this.desktopPingIntervalID = setInterval(()=>{this.gameCable.desktopPing({action:"desktop_connection_ping", type:"desktop_ping", body:{active: true}})}, 1000)
  }

  // Connection Observers
  initMobileConnectionObserver(){
    this.mobileConnectionObserverIntervalID = setInterval(()=>{
      // checks if mobile is connected
      if(this.lastPingFromMobile < Date.now()-10000 && this.DesktopGameManager){
        this.cancelGame({body:{device: "desktop"}})
      }else if(this.lastPingFromMobile < Date.now()-2000){
        if(this.DesktopGameManager){
          this.DesktopGameManager.pauseGame()
          this.mobileConnectionWarning.style.display = "block"
        }
        this.mobileConnected = false
        this.mobileConnectedAlert.style.display = "none"
        this.startGameButton.style.display = "none"
      } else {
        if(this.DesktopGameManager){
          this.DesktopGameManager.resumeGame()
          this.mobileConnectionWarning.style.display = "none"
        }

        this.mobileConnected = true
        this.mobileConnectedAlert.style.display = "block"
        this.startGameButton.style.display = "block"

        // Checks if user is focused on mobile window
        if(!this.mobileActive){
          if(this.DesktopGameManager){
            this.DesktopGameManager.pauseGame()
            this.mobileUnactiveWarning.style.display = "block"
          }
          this.mobileUnactiveAlert.style.display = "block"
          this.startGameButton.style.display = "none"
        }else{
          if(this.DesktopGameManager){
            this.DesktopGameManager.resumeGame()
            this.mobileUnactiveWarning.style.display = "none"
          }
          this.startGameButton.style.display = "block"
          this.mobileUnactiveAlert.style.display = "none"
        }
      }
    }, 500)
  }
}

export {DesktopPageManager}