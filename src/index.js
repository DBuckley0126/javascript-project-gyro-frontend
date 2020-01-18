import _ from 'actioncable';

const ENV = "production"

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
            console.log(data["body"])
            coordinatesDisplay.innerText = data["body"]["x"].toString()
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
        alert.innerText = `subscription rejected to game ${joinCode}`
      }
    })

    // window.addEventListener("mousemove", event => {
    //   var x = event.clientX;     // Get the horizontal coordinate
    //   var y = event.clientY;     // Get the vertical coordinate
    //   var coor = "X coords: " + x + ", Y coords: " + y;
  
    //   App.game.sendMessage({coor: coor})
    // })

    // let loop = window.setInterval(()=>{App.game.sendMessage({coor: Math.floor(10000 + (90000 - 10000) * Math.random())})}, 500)
    // loop
})



  joinButton.addEventListener("click", event => {
    let joinCode = codeInput.value

    App.game = App.cable.subscriptions.create({channel: "GameChannel", join_code: joinCode, mobile: true}, {
      received: function(data){
        switch(data["type"]){
          case "broadcast":
            // console.log(data["body"]["coor"])
            // coordinatesDisplay.innerText = data["body"]["coor"]
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
        alert.innerText = `subscription rejected to game ${joinCode}`
      }
    })

    let x = 0
    window.addEventListener('deviceorientation', event => {
      console.log(event.alpha + ' : ' + event.beta + ' : ' + event.gamma);
      // x = event.beta;  // In degree in the range [-180,180]
      x = event.beta; // In degree in the range [-90,90]

      // Because we don't want to have the device upside down
      // We constrain the x value to the range [-90,90]
      // if (x >  90) { x =  90};
      // if (x < -90) { x = -90};

      // To make computation easier we shift the range of
      // x and y to [0,180]
      // x += 90;
      x += 90;

      // 10 is half the size of the ball
      // It center the positioning point to the center of the ball
      // ball.style.top  = (maxY*y/180 - 10) + "px";
      // ball.style.left = (maxX*x/180 - 10) + "px";
    })

    let loop = window.setInterval(()=>{App.game.sendMessage({x: x})}, 100)
  })

})