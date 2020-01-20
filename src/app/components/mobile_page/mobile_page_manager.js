import {CableAdapter} from '../../modules'
import { MobileGameManager } from '../../modules'

class MobilePageManager{

  constructor(container){
    this.container = container.querySelector("#mobile-container")
    this.initConnection()
    this.renderIndex()
    this.gyroscopeData = {x: null, y: null, z: null}
    this.userActive = true
    this.lastPingFromDesktop = null
    this.desktopConnected = false

  }

  // Inital render of desktop
  async renderIndex(){
    try{
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
    this.joinGameButton = this.container.querySelector("#join-game-button")
    this.alert = this.container.querySelector(".alert")
    this.coordinatesDisplay = this.container.querySelector(".coordinates-display")
    this.joinCodeInput = this.container.querySelector("#join-code-input")
    this.desktopDisconnectAlert = this.container.querySelector("#desktop-disconnected-alert")
    this.fullscreenReqestButton = this.container.querySelector(".fullscreen-request-button")

    // Initialise listeners
    this.addJoinGameListener(this.joinGameButton)
    this.addUserFocusListeners(window)

    return Promise.resolve("Finished setting bindings and listeners")
  }

  // Listeners
  addJoinGameListener(element){
    element.addEventListener("click", event => {
      let joinCode = this.joinCodeInput.value
      this.initGameSubscription(joinCode)
    })
  }
  addUserFocusListeners(element, context = this){
    element.addEventListener('focus', function(){
      console.log("focus")
      context.userActive = true
    });
    element.addEventListener('blur', function(){
      console.log("unfocus")
      context.userActive = false
    });
  }

  addGyroscopeListener(element){
    element.addEventListener('deviceorientation', (event,context = this) => {
      let tempX = event.gamma; // In degree in the range [-90,90]

      // Because we don't want to have the device upside down
      // We constrain the x value to the range [-90,90]
       if (tempX >  90) { tempX =  90};
       if (tempX < -90) { tempX = -90};

      // To make computation easier we shift the range of
      tempX += 90;

      // Round value to nearest whole number
      context.gyroscopeData = {x: Math.round(tempX), y: null, z: null}

      context.MobileGameManager.sensorData = {x: context.gyroscopeData["x"]}

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
    this.gameCable = this.adapter.cable.subscriptions.create({channel: "GameChannel", join_code: joinCode, mobile: true}, {
      received: function(data){
        context.cableDataHandler(data)
      },
      sendMessage: function(payload){
      },
      sensorDataRelay: function(payload){
        this.perform('sensor_data_relay', payload)
      },
      rejected: function(data){
        let error = {type:"connection_failed", statusText: `Failed to join game with join code ${joinCode}`}
        context.failureNotice(error)
      }
    })
  }

  // Data handler(switch) for data received from subscription
  cableDataHandler(data){
    switch(data["type"]){  
      case "subscribed":
        switch(data["action"]){
          case "game_join_success":
            console.log("Join game success")
            this.MobileGameManager = new MobileGameManager(this)
            this.addGyroscopeListener(window)
            this.addGryoscopeBroadcaster(window)
            this.initDesktopConnectionObserver()
            break
        }
        this.alertNotice({type:"connection_success", statusText: data["body"]["message"]})
        break  

      case "desktop_ping":
        console.log("Desktop ping received")
        this.lastPingFromDesktop = Date.now()
        break  
    }
  }

  // User notices/warnings
  failureNotice(error = {type:"undefiend",statusText: "Failure Unknown"}){
    console.log(error)
    alert(error.statusText)
  }

  alertNotice(notice = {type:"undefiend",statusText: "Notice Unknown"}){
    console.log(notice)
    this.alert.innerText = notice.statusText
  }

  // Broadcasters
  addGryoscopeBroadcaster(element){
    element.setInterval(()=>{this.gameCable.sensorDataRelay({action:"gyroscrope_data_push", type:"sensor_data_relay", body:{x: this.gyroscopeData.x, user_active: (this.userActive == true)}})}, 100)
  }

  // Connection Observers
  initDesktopConnectionObserver(){
    setInterval(()=>{
      // checks if desktop is connected
      if(this.lastPingFromDesktop < Date.now()-1500){
        this.desktopConnected = false
        this.desktopDisconnectAlert.style.display = "block"
        this.MobileGameManager.connectionStatus = {connection: false}
      } else {
        this.desktopConnected = true
        this.desktopDisconnectAlert.style.display = "none"
        this.MobileGameManager.connectionStatus = {connection: true}
      }
    }, 1000)
  }

}

export {MobilePageManager}