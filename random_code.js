import {AppManager} from './components/app_manager'
import '../stylesheets/app.css'
import Matter from 'matter-js'
import * as _ from 'pixi.js'
// import catImgURL from '../../assets/img/cat.png'
import * as pixiTestJSON from '../../assets/img/pixi_test.json'
import pixiTestPNG from '../../assets/img/pixi_test.png'


function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const PIXI = _

  // matter-js aliases
  const Engine = Matter.Engine,
      Render = Matter.Render,
      World = Matter.World,
      Bodies = Matter.Bodies;
  


// document.addEventListener('DOMContentLoaded', () => {

  // const container = document.querySelector('#app-container')
  // window.AppManager = new AppManager(container)



  // class Game {
  //   constructor(){
  //     // create an engine
  //     this.canvas = document.querySelector('#world')
  //     this.engine = Engine.create()
  //     // create a renderer
  //     this.render = Render.create({
  //       canvas: this.canvas,
  //       engine: this.engine,
  //       options: {
  //         width: 800,
  //         height: 800,
  //         background: 'black',
  //         wireframes: true,
  //         showAngleIndicator: true
  //       }
  //       })
  //     this.initBodies()
  //     this.runEngine()
  //     this.runRender()  
  //   }

  //   initBodies(){
  //     // create two boxes and a ground
  //     var boxA = Bodies.rectangle(400, 200, 80, 80);
  //     var boxB = Bodies.rectangle(450, 50, 80, 80);
  //     var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

  //     // add all of the bodies to the world
  //     World.add(this.engine.world, [boxA, boxB, ground]);
  //   }

  //   runEngine(){
  //     Engine.run(this.engine);
  //   }

  //   runRender(){
  //     Render.run(this.render);
  //   }
  // }

  // const game = new Game

//   // PIXI aliases
//   const Loader = PIXI.Loader.shared,
//         Resources = PIXI.Loader.resources,
//         Sprite = PIXI.Sprite,
//         Utils = PIXI.utils,
//         TextureCache = PIXI.utils.TextureCache

// //Create a Pixi Application
// let app = new PIXI.Application({ 
//   width: 1000, 
//   height: 1000,                       
//   antialias: true, 
//   transparent: false, 
//   resolution: 1
// }
// );

// //Add the canvas that Pixi automatically created for you to the HTML document
// document.querySelector("#canvas").appendChild(app.view);

// const sprites = {}

// //load an image and run the `setup` function when it's done
// Loader
// .add([
//   {url: './assets/img/pixi_test.json'}
// ])
// .on("progress", loadProgressHandler)
// .load(setup);

// function loadProgressHandler(loader, resource) {

//   //If you gave your files names as the first argument 
//   //of the `add` method, you can access them like this
//   console.log("loading: " + resource.name); 

//   //Display the percentage of files currently loaded
//   console.log("progress: " + loader.progress + "%"); 
// }

// //This `setup` function will run when the image has loaded
// function setup() {

//   //Create the cat sprite
//   var catSprite = new PIXI.Sprite(TextureCache["cat.png"]);

//     //Change the sprite's attributes
//     catSprite.anchor.set(0.5, 0.5)
//     // catSprite.position.set(300, 300)
//     catSprite.x = 300
//     catSprite.y = ((app.view.height / 2) - (catSprite.height / 2))
//     catSprite.width = 80
//     catSprite.height = 120
//     catSprite.scale.set(2, 2);
//     catSprite.vx = 0;
//     catSprite.vy = 0;

//     var catSprite2 = new PIXI.Sprite(TextureCache["cat.png"]);

//     //Change the sprite's attributes
//     catSprite2.anchor.set(0.5, 0.5)
//     // catSprite.position.set(300, 300)
//     catSprite2.x = 100
//     catSprite2.y = ((app.view.height / 2) - (catSprite.height / 2))
//     catSprite2.width = 200
//     catSprite2.height = 200
//     catSprite2.scale.set(2, 2);
//     catSprite2.vx = 0;
//     catSprite2.vy = 0;


//     let cats = new PIXI.Container()
//     cats.addChild(catSprite, catSprite2)

//   //Add the cat to the stage
//   app.stage.addChild(cats);

//   // drawing a rectangle
//   let rectangle = new PIXI.Graphics();
//   rectangle.lineStyle(4, 0xFF3300, 1);
//   rectangle.beginFill(0x66CCFF);
//   rectangle.drawRect(0, 0, 64, 64);
//   rectangle.endFill();
//   rectangle.x = 170;
//   rectangle.y = 170;
//   app.stage.addChild(rectangle);

//   // drawing a triangle with polygon tool
//   let triangle = new Graphics();
//   triangle.beginFill(0x66FF33);
  
//   //Use `drawPolygon` to define the triangle as
//   //a path array of x/y positions
  
//   triangle.drawPolygon([
//       -32, 64,             //First point
//       32, 64,              //Second point
//       0, 0                 //Third point
//   ]);
  
//   //Fill shape's color
//   triangle.endFill();
  
//   //Position the triangle after you've drawn it.
//   //The triangle's x/y position is anchored to its first point in the path
//   triangle.x = 180;
//   triangle.y = 22;
  
//   app.stage.addChild(triangle);  


//   //Start the game loop by adding the `gameLoop` function to
//   //Pixi's `ticker` and providing it with a `delta` argument.
//   app.ticker.add(delta => gameLoop(delta));
// }

// //Set the game state
// const state = play;

// function gameLoop(delta){

//   //Update the current game state:
//   state(delta);

// }

// function play(delta){
//   let catSprite = app.stage.children[0].children[0]
//   //Update the cat's velocity
//   catSprite.vx = 1;
//   catSprite.vy = 1;

//   //Apply the velocity values to the cat's 
//   //position to make it move
//   catSprite.x += catSprite.vx;
//   catSprite.y += catSprite.vy;
// }

// })


// function keyboard(value) {
//   let key = {};
//   key.value = value;
//   key.isDown = false;
//   key.isUp = true;
//   key.press = undefined;
//   key.release = undefined;
//   //The `downHandler`
//   key.downHandler = event => {
//     if (event.key === key.value) {
//       if (key.isUp && key.press) key.press();
//       key.isDown = true;
//       key.isUp = false;
//       event.preventDefault();
//     }
//   };

//   //The `upHandler`
//   key.upHandler = event => {
//     if (event.key === key.value) {
//       if (key.isDown && key.release) key.release();
//       key.isDown = false;
//       key.isUp = true;
//       event.preventDefault();
//     }
//   };

//   //Attach event listeners
//   const downListener = key.downHandler.bind(key);
//   const upListener = key.upHandler.bind(key);
  
//   window.addEventListener(
//     "keydown", downListener, false
//   );
//   window.addEventListener(
//     "keyup", upListener, false
//   );
  
//   // Detach event listeners
//   key.unsubscribe = () => {
//     window.removeEventListener("keydown", downListener);
//     window.removeEventListener("keyup", upListener);
//   };
  
//   return key;
// }



