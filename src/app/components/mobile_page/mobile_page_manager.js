import {CableAdapter} from '../../modules'

class MobilePageManager{

  constructor(container){
    this.container = container.querySelector("#mobile-container")
    this.initConnection()
    this.renderIndex()
    this.gyroscopeData = {x: null, y: null, z: null}
    this.userActive = true

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
    this._game = this.adapter.cable.subscriptions.create({channel: "GameChannel", join_code: joinCode, mobile: true}, {
      received: function(data){
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
        let error = {statusText: `Failed to join game with join code ${joinCode}`}
        context.failureNotice(error)
      }
    })
  }

  // Data handler(switch) for data received from subscription
  cableDataHandler(data){
    switch(data["type"]){
      case "sensor_data_relay":
        // console.log(data["body"]["coor"])
        // coordinatesDisplay.innerText = data["body"]["coor"]
        break
        
      case "subscribed":
        switch(data["action"]){
          case "game_join_success":
            this.addGyroscopeListener(window)
            this.addGryoscopeBroadcaster(window)
            break
        }
        this.alertNotice({statusText: data["body"]["message"]})
        break  

      default:
        let error = {statusText: "Unable to handle data received from cable connection", data: data}
        this.failureNotice(error)
    }
  }

  // User notices/warnings
  failureNotice(error = {statusText: "Failure Unknown"}){
    console.log(error)
    alert(error.statusText)
  }

  alertNotice(notice = {statusText: "Notice Unknown"}){
    console.log(notice)
    this.alert.innerText = notice.statusText
  }

  // Broadcasters
  addGryoscopeBroadcaster(element){
    debugger
    element.setInterval(()=>{this._game.sensorDataRelay({action:"gyroscrope_data_push", type:"sensor_data_relay", body:{x: this.gyroscopeData.x, user_active: (this.userActive == true)}})}, 100)
  }
}

export {MobilePageManager}