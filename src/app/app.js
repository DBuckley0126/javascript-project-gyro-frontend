import {AppManager} from './components/app_manager'
import '../stylesheets/app.css'


document.addEventListener('DOMContentLoaded', () => {

  const container = document.querySelector('#app-container')
  window.AppManager = new AppManager(container)

})







// document.addEventListener("DOMContentLoaded",() => {


//   // window.App || (window.App = {})

//   // App.cable = _.createConsumer( ENV == "development" ? `ws://localhost:3000/cable` : "wss://javascript-project-gyro-back.herokuapp.com/cable")


// //   createButton.addEventListener("click", event => {
// //     let joinCode = Math.floor(10000 + (90000 - 10000) * Math.random());
    
// //     joinCodeAlert.innerText = joinCode

// //     // App.game = App.cable.subscriptions.create({channel: "GameChannel", join_code: joinCode, mobile: false}, {
// //     //   received: function(data){

// //     //   },
// //     //   sendMessage: function(messageBody){
// //     //     this.perform('data_relay', {body: messageBody})
// //     //   },
// //     //   rejected: function(data){
// //     //     alert.innerText = `subscription rejected to game ${joinCode}`
// //     //   }
// //     // })
// // })



//   joinButton.addEventListener("click", event => {
//     let joinCode = codeInput.value

//     App.game = App.cable.subscriptions.create({channel: "GameChannel", join_code: joinCode, mobile: true}, {
//       received: function(data){
//         switch(data["type"]){
//           case "broadcast":
//             // console.log(data["body"]["coor"])
//             // coordinatesDisplay.innerText = data["body"]["coor"]
//             break
//           case "alert":
//             alert.innerText = data["body"]["message"] 
//             break  
//         }
//       },
//       sendMessage: function(messageBody){
//         this.perform('data_relay', {body: messageBody})
//       },
//       rejected: function(data){
//         alert.innerText = `subscription rejected to game ${joinCode}`
//       }
//     })

//     let x = 0
//     window.addEventListener('deviceorientation', event => {
//       tempX = event.gamma; // In degree in the range [-90,90]

//       // Because we don't want to have the device upside down
//       // We constrain the x value to the range [-90,90]
//        if (tempX >  90) { tempX =  90};
//        if (tempX < -90) { tempX = -90};

//       // To make computation easier we shift the range of
//       tempX += 90;

//       // Round value to nearest whole number
//       x = Math.round(tempX)

//     })

//     let loop = window.setInterval(()=>{App.game.sendMessage({x: x})}, 100)
//   })

// })