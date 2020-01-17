import _ from 'actioncable';

const ENV = "development"

document.addEventListener("DOMContentLoaded",() => {

  let createButton = document.querySelector("#create-button")
  let joinButton = document.querySelector("#join-button")
  let desktopDiv = document.querySelector("#desktop-div")
  let mobileDiv = document.querySelector("#mobile-div")
  let alert = document.querySelector("#alert")
  let codeInput = document.querySelector("#code-input")
  let joinCodeAlert = document.querySelector("#join-code")
  let coordinatesDisplay = document.querySelector("#coordinates-display")

  window.App || (window.App = {})

  App.cable = _.createConsumer( ENV == "development" ? `ws://localhost:3000/cable` : "wss://javascript-project-gyro-back.herokuapp.com/cable")

  

  function checkDevice(){
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      desktopDiv.style.display = "none"
      mobileDiv.style.display = "block"
      return true
     } else {
      desktopDiv.style.display = "block"
      mobileDiv.style.display = "none"
       return false
     }
  }

  checkDevice()

  createButton.addEventListener("click", event => {
    let joinCode = Math.floor(10000 + (90000 - 10000) * Math.random());
    
    joinCodeAlert.innerText = joinCode

    App.game = App.cable.subscriptions.create({channel: "GameChannel", join_code: joinCode, mobile: false}, {
      received: function(data){
        switch(data["type"]){
          case "broadcast":
            break
          case "alert":
            alert.innerText = data["body"]["message"] 
            break  
        }

      },
      sendMessage: function(messageBody){
        this.perform('data_relay', {body: messageBody})
      },
      rejected: function(data){
        console.log("subscription rejected")
      }
    })

    window.addEventListener("mousemove", event => {
      var x = event.clientX;     // Get the horizontal coordinate
      var y = event.clientY;     // Get the vertical coordinate
      var coor = "X coords: " + x + ", Y coords: " + y;
  
      App.game.sendMessage({button_pressed: true, coor: coor})
    })
})

  joinButton.addEventListener("click", event => {
    let joinCode = codeInput.value

    App.game = App.cable.subscriptions.create({channel: "GameChannel", join_code: joinCode, mobile: true}, {
      received: function(data){
        switch(data["type"]){
          case "broadcast":
            console.log(data["body"]["coor"])
            coordinatesDisplay.innerText = data["body"]["coor"]
          case "alert":
            alert.innerText = data["body"]["message"] 
            break  
        }
      },
      sendMessage: function(messageBody){
        this.perform('data_relay', {body: messageBody})
      },
      rejected: function(data){
        alert.innerText = `subscription rejected to game ${joinCode}`
      }
    })

  })

})