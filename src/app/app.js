// const container = document.querySelector('#app-container')
// window.AppManager = new AppManager(container)

import {AppManager, MobileGameManager} from './modules'
import '../stylesheets/app.css'
// import Matter from 'matter-js'

// import catImgURL from '../../assets/img/cat.png'
// import * as pixiTestJSON from '../../assets/img/pixi_test.json'
// import pixiTestPNG from '../../assets/img/pixi_test.png'
// import * as p5 from '../.././node_modules/p5/lib/p5.js'
// import * as p5 from 'p5'


// function randomInt(min, max) {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

  // // module aliases
  // const Engine = Matter.Engine,
  // World = Matter.World,
  // Bodies = Matter.Bodies;



document.addEventListener('DOMContentLoaded', () => {

  window.game = new MobileGameManager

  document.addEventListener('keydown', logKey);

  function logKey(e) {
  if(e.key == "ArrowRight"){
    let currentSensor = game.sensorData
    window.game.sensorData = {x: currentSensor.x + 1, y:0, z:0}
    console.log(window.game.sensorData)
  } else if(e.key === "ArrowLeft"){
    let currentSensor = game.sensorData
    window.game.sensorData = {x: currentSensor.x - 1, y:0, z:0}
    console.log(window.game.sensorData)
  } else if(e.key === "ArrowUp"){
    let currentSensor = game.sensorData
    window.game.gunButtonPressed = true
    setTimeout(()=>{window.game.gunButtonPressed = false}, 50)
    console.log(window.game.sensorData)
  } else {
    console.log(e.key)
  }
  }

  setInterval(()=>{
    
  }, 500)

})





