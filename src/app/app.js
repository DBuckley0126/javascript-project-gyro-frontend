import {AppManager, MobileGameManager, DesktopGameManager} from './modules'
import '../stylesheets/app.css'

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('#app-container')
  window.AppManager = new AppManager(container)

  // document.addEventListener('keydown', logKey);

  // function logKey(e) {
  // if(e.key == "ArrowRight"){
  //   let currentSensor = game.sensorData
  //   window.game.sensorData = {x: currentSensor.x + 1, y:0, z:0}
  //   console.log(window.game.sensorData)
  // } else if(e.key === "ArrowLeft"){
  //   let currentSensor = game.sensorData
  //   window.game.sensorData = {x: currentSensor.x - 1, y:0, z:0}
  //   console.log(window.game.sensorData)
  // } else if(e.key === "ArrowUp"){
  //   let currentSensor = game.sensorData
  //   window.game.gunButtonPressed = true
  //   setTimeout(()=>{window.game.gunButtonPressed = false}, 50)
  //   console.log(window.game.sensorData)
  // } else {
  //   console.log(e.key)
  // }
  // }

})





