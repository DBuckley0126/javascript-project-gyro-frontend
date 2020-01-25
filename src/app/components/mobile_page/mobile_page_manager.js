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

  //
  // ─── INITAL RENDER OF DESKTOP ───────────────────────────────────────────────────
  //
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
    this.cancelGameButton = this.container.querySelector("#mobile-game-cancel-button")
    this.waitingAlert = this.container.querySelector("#mobile-game-waiting-alert")

    // Initialise listeners
    this.addJoinGameListener(this.joinGameButton)
    this.addUserFocusListeners(window)
    this.addCancelGameListener(this.cancelGameButton)

    return Promise.resolve("Finished setting bindings and listeners")
  }

  //
  // ─── LISTENERS ──────────────────────────────────────────────────────────────────
  //
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

  addCancelGameListener(element){
    element.addEventListener("click", event => {
      this.gameCable.cancelGame({action:"mobile_canceled_game", type:"cancel_game", body: {device: "mobile"}})
    })
  }



  //
  // ─── CREATE CABLE CONNECTION FOR CONSUMER ───────────────────────────────────────
  //
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

  //
  // ─── Create subscription from DesktopPageManager's cable using joinCode ───────────────────────────────────────────────────────────────────────────
  //
  initGameSubscription(joinCode, context = this){
    this.gameCable = this.adapter.cable.subscriptions.create({channel: "GameChannel", join_code: joinCode, mobile: true}, {
      received: function(data){
        context.cableDataHandler(data)
      },
      sensorDataRelay: function(payload){
        this.perform('sensor_data_relay', payload)
      },
      gameState: function(payload){
        this.perform('game_state', payload)
      },
      rejected: function(data){
        let error = {type:"connection_failed", statusText: `Failed to join game with join code ${joinCode}`}
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

  //
  // ─── Data handler(switch) for data received from subscription ───────────────────────────────────────────────────────────────────────────
  //

  cableDataHandler(data){
    switch(data["type"]){  
      case "subscribed":
        switch(data["action"]){
          case "game_join_success":
            console.log("Join game success")
            this.joinGameButton.style.display = "none"
            this.joinCodeInput.style.display = "none"
            this.cancelGameButton.style.display = "block"
            this.waitingAlert.style.display = "block"
            this.MobileGameManager = new MobileGameManager(this)
            this.initDesktopConnectionObserver()
            break
        }
        this.alertNotice({type:"connection_success", statusText: data["body"]["message"]})
        break  
      case "desktop_ping":
        console.log("Desktop ping received")
        this.lastPingFromDesktop = Date.now()
        break
      case "game_state":
        console.log("game_state received")
        console.log(data)
        this.gameStateHandler(data)
        break
      case "cancel_game":
        console.log("cancel_game received")
        this.cancelGame(data)
        case "unsubscribed":
          let device = null
          if(data["mobile"]){
            device = "Mobile"
          }else{
            device = "desktop"
          }
          console.log(`${device} has unsubscribed from game channel ${data["channel"]}`)
          if(data["mobile"] == false){
            if(this.gameCable){this.gameCable.cancelGame({action:"mobile_canceled_game_from_desktop_unsubscribe", type:"cancel_game", body: {device: "mobile"}})}
          }
          break          
    }
  }

  //
  // ─── GAME STATE HANDLER ───────────────────────────────────────────────────────────────────────────
  //

  gameStateHandler(data){
    switch(data["body"]["action"]){
      case "start_game":
      
      // this.waitingAlert.style.display = "none"
      break
    }
  }
    

  //
  // ─── CANCEL GAME REQUEST RECEIVED───────────────────────────────────────────────────────────────────────────
  //

  cancelGame(data){
    //{action:"mobile_unsubscribe", type:"unsubscribed", body: {device: "mobile"}}
    this.gameCable.unsubscribed()
    this.MobileGameManager.destroyAndHideGame()
    clearInterval(this.desktopConnectionObserverIntervalID)
    clearInterval(this.gryoscropeBroadcasterIntervalID)
    this.waitingAlert.style.display = "none"
    this.joinGameButton.style.display = "block"
    this.joinCodeInput.value = ""
    this.joinCodeInput.style.display = "block"
    this.cancelGameButton.style.display = "none"
    this.alertNotice({type:"cancel_game", statusText: `${data["body"]["device"]} has canceled the game`})
  }  

  //
  // ─── User notices/warnings ───────────────────────────────────────────────────────────────────────────
  //

  failureNotice(error = {type:"undefiend",statusText: "Failure Unknown"}){
    console.log(error)
    alert(error.statusText)
  }

  alertNotice(notice = {type:"undefiend",statusText: "Notice Unknown"}){
    clearTimeout(this.alertTimeoutID)
    this.alert.style.display = "block"
    this.alert.innerHTML = notice.statusText
    console.log(notice)
    this.alertTimeoutID = setTimeout(function(){
      this.alert.innerHTML = ""
      this.alert.style.display = "none"
    }.bind(this), 4000)

  }

  //
  // ─── CONNECTION OBSERVERS ───────────────────────────────────────────────────────
  //
  
  initDesktopConnectionObserver(){
    this.desktopConnectionObserverIntervalID = setInterval(()=>{
      // checks if desktop is connected
      if(this.lastPingFromDesktop < Date.now()-1500){
        this.desktopConnected = false
        this.desktopDisconnectAlert.style.display = "block"
        // this.MobileGameManager.connectionStatus = {connection: false}
      } else {
        this.desktopConnected = true
        this.desktopDisconnectAlert.style.display = "none"
        if(this.MobileGameManager){this.MobileGameManager.connectionStatus = {connection: true}}
      }
    }, 1000)
  }

}

export {MobilePageManager}