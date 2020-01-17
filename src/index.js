import _ from 'actioncable';

document.addEventListener("DOMContentLoaded",() => {

  let button = document.querySelector("#trigger-button")
  let alert = document.querySelector("#alert")

  window.App || (window.App = {})

  App.cable = _.createConsumer("wss://javascript-project-gyro-back.herokuapp.com/cable")
  App.message = App.cable.subscriptions.create("GameChannel", {
    received: function(data){
      alert.innerText = data["body"]["coor"]
    },
    sendMessage: function(messageBody){
      this.perform('button_pressed', {body: messageBody})
    }
  })


  window.addEventListener("mousemove", event => {
    var x = event.clientX;     // Get the horizontal coordinate
    var y = event.clientY;     // Get the vertical coordinate
    var coor = "X coords: " + x + ", Y coords: " + y;

    App.message.sendMessage({button_pressed: true, coor: coor})
  })

  

  button.addEventListener("click", event => {
    App.message.sendMessage({button_pressed: true})
  })

})





