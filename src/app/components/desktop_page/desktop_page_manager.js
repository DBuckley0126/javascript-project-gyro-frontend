import {CableAdapter} from '../../modules'

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

    // Initialise listeners
    this.addGameCreateListener(this.createGameButton)
    
    return Promise.resolve("Finished setting bindings and listeners")
  }

  // Listeners
  addGameCreateListener(element){
    element.addEventListener("click", event => {
      let joinCode = Math.floor(10000 + (90000 - 10000) * Math.random());
      this.initGameSubscription(joinCode)
      this.joinCodeDisplay.innerText = joinCode
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
      return Promise.resolve("Finished setting bindings and Listeners")
    } else {
      return Promise.reject("Failed to create Adapter")
    }
  }
  

  // Create subscription from DesktopPageManager's cable using joinCode
  initGameSubscription(joinCode, context = this){
    this._game = this.adapter.cable.subscriptions.create({channel: "GameChannel", join_code: joinCode, mobile: false}, {
      received: function(data){
        console.log("received data from cable")
        context.cableDataHandler(data)
      },
      dataRelay: function(payload){
        this.perform('data_relay', payload)
      },
      sendMessage: function(payload){

      },
      sensorDataRelay: function(payload){
        this.perform('sensor_data_relay', payload)
      },
      rejected: function(data){
        let error = {statusText: `Failed to create game for join code ${joinCode}`}
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
            this.initMobileConnectionObserver()
            break
          case "game_create_success":
            console.log("game create seccess")
            this.joinCodeDisplay.style.display = "block"
            break  
        }
        this.alertNotice({statusText: data["body"]["message"]})
        break
        
      default:
        let error = {statusText: "Unable to handle data received from cable connection", data: data}
        this.failureNotice(error)
    }
  }

  // Handle data relay from cable
  handleSensorDataRelay(data){
    this.lastPingFromMobile = Date.now()
    this.mobileActive = data["body"]["user_active"]
    console.log(data["body"])
    console.log(data["body"]["user_active"])
    if(data["body"]["x"]){this.coordinatesDisplay.innerText = data["body"]["x"].toString()}
  }

  // User notices/warnings
  failureNotice(error = {statusText: "Failure Unknown"}){
    console.log(error)
    alert(error.statusText)
  }

  alertNotice(notice = {statusText: "Failure Unknown"}){
    console.log(notice)
    this.alert.innerHTML = notice.statusText
  }

  // Connection Observers
  initMobileConnectionObserver(){
    setInterval(()=>{
      console.log("ping check begin")

      // checks if mobile is connected
      if(this.lastPingFromMobile < Date.now()-1500){
        this.mobileConnected = false
        this.mobileConnectedAlert.style.display = "none"
      } else {
        this.mobileConnected = true
        this.mobileConnectedAlert.style.display = "block"
      }
      // Checks if user is focused on mobile window
      if(!this.mobileActive && this.mobileConnected){
        this.mobileUnactiveAlert.style.display = "block"
      }else{
        this.mobileUnactiveAlert.style.display = "none"
      }
    }, 500)
  }

}

export {DesktopPageManager}