global.decomp = require('poly-decomp');

import Matter, { Query } from 'matter-js'
import * as p5 from 'p5'
import {GameManager, BoxElement, SpaceshipElement, BulletElement, CompleteAstroidElement} from '../../modules'
import * as elementVerticesJSON from '../../../../assets/json/gyro_element_vertices.json'

// IMAGES
import spaceshipImgURL from '../../../../assets/img/spaceship.png'
import bulletImgURL from '../../../../assets/img/bullet.png'
import completeAstroidImgURL from '../../../../assets/img/complete-astroid.png'

// module aliases
const Engine = Matter.Engine, World = Matter.World, Bodies = Matter.Bodies, Render = Matter.Render, Vertices = Matter.Vertices, Body = Matter.Body, Composite = Matter.Composite, Events = Matter.Events

class MobileGameManager extends GameManager{

  constructor(PageManager){
    super(PageManager)
    this._axisX = 0
    this._axisY = 0
    this._axisZ = 0
    this.gunButtonPressed = false
    this.engine = null
    this.world = null
    this.boxes = []
    this.bulletElementsContainer = []
    this.completeAstroidElementsContainer = []
    this.ground = null
    this.textureContainer = {}
    this.createGameInstance()
    this.elementVertices = elementVerticesJSON.default
  }

  //
  // ─── EXTERNAL DATA INTERFACE ───────────────────────────────────────────────────────────────────────────
  //

  set connectionStatus(obj){
    this.connectionStatus = obj["connected"]
  }

  //
  // ─── MATTER + P5 ───────────────────────────────────────────────────────────────────────────
  //

  createGameInstance(){
    this.P5engine = new p5((sketch) => {this.initSketchInstance(sketch)}, document.querySelector('#canvas'))
  }

  initSketchInstance(sketch){
    this.sketch = sketch
    this.preload()
    this.setup()
    this.draw()
  }

  preload(){
    this.sketch.preload = () => {
      Object.assign(this.textureContainer, {spaceshipImg: this.sketch.loadImage(spaceshipImgURL)}, {bulletImg: this.sketch.loadImage(bulletImgURL)}, {completeAstroidImg: this.sketch.loadImage(completeAstroidImgURL)})
    }
  }

  setup(){
    this.sketch.setup = () =>{
      this.sketch.createCanvas(1000, 1000)
      this.sketch.background(40)
      this.sketch.frameRate(60)

      this.engine = Engine.create()
      this.world = this.engine.world
      this.world.gravity.y = 0
      this.world.bounds = {min:{x: -500 ,y: -500}, max: {x: 1500, y: 1500}}
      this.ground = Bodies.rectangle(500, 900, 1000, 200, {isStatic: true})
      this.spaceship = new SpaceshipElement(500, 800, 0.5, this)
      this.ground.label = "ground"
      this.lastTimeGunFired = 0

      World.add(this.world, [this.ground])
      this.randomBoxDrop(2000)
      this.produceDevCanvas()
      this.initIntervalCleanUp()
      this.initCollisionDetection()

    }
  }

  draw(){
    this.sketch.draw = () =>{
      Engine.update(this.engine)
      this.sketch.push()
      this.sketch.background(51)
      this.sketch.noStroke(255)
      this.sketch.fill(170)
      this.sketch.rectMode(this.sketch.CENTER)
      this.sketch.rect(this.ground.position.x, this.ground.position.y, 1000, 200)
      this.sketch.pop()
      this.spaceship.show()
      
      for(const bulletElement of this.bulletElementsContainer){
        bulletElement.show()
      }
      for(const completeAstroidElement of this.completeAstroidElementsContainer){
        completeAstroidElement.show()
      }

      this.reactToMovementControl()
      this.reactToGunControl()

      this.boxes.forEach((box) => {
        box.show()
      })
    }
  }

  reactToMovementControl(){
    const startingPoint = 500
    const movementMultiplier = this._axisX * 10
    const px = startingPoint + movementMultiplier
    Body.setVelocity(this.spaceship.matterBody, {x: px - this.spaceship.matterBody.position.x, y: 0})
    Body.setPosition(this.spaceship.matterBody, {x: px, y: this.spaceship.matterBody.position.y})
  }

  reactToGunControl(){
    
    if(this.gunButtonPressed && this.lastTimeGunFired < Date.now() - 500){
      new BulletElement(this.spaceship.gunPosition["x"], this.spaceship.gunPosition["y"], 1, this)
      this.lastTimeGunFired = Date.now()
    }
  }

  randomBoxDrop(ms){
    setInterval((context = this)=>{
      const x = GameManager.randomInt(100,900)
      const y = 100
      const completeAstroidElement = new CompleteAstroidElement(x, y, 0.2, context)
      context.completeAstroidElementsContainer.push(completeAstroidElement)
    }, ms)
  }

  initIntervalCleanUp(){
    setInterval(function(){
      const context = this.game
      let outsideWorldContainer = Matter.Query.region(Composite.allBodies(context.world), context.world.bounds, {outside: true})
      for(const matterBody of outsideWorldContainer){
        // checks if matterBody matches element in bulletElementsContainer and removes
        const selectedBulletElement = context.bulletElementsContainer.find(bulletElement => bulletElement.matterBody === matterBody)
        if(selectedBulletElement){selectedBulletElement.remove()}
        // checks if matterBody matches element in compleAstroidElementsContainer and removes
        const selectedCompleteAstroidElement = context.completeAstroidElementsContainer.find(completeAstroidElement => completeAstroidElement.matterBody === matterBody)
        if(selectedCompleteAstroidElement){selectedCompleteAstroidElement.remove()}
      }
      Composite.remove(context.world, outsideWorldContainer)
    }, 1000)
  }

  initCollisionDetection(){
    Events.on(this.engine, 'collisionStart', function(event){
      const pairsArray = event.pairs;

      for( const pair of pairsArray){
        if (pair.bodyA.label == "BulletElement"){
          remove
        }
      }

      // change object colours to show those starting a collision
      // for (var i = 0; i < pairs.length; i++) {
      //     var pair = pairs[i];
      //     pair.bodyA.render.fillStyle = '#333';
      //     pair.bodyB.render.fillStyle = '#333';
      // }
    })
  }

  produceDevCanvas(){
    this.render = Render.create({
      element: document.querySelector("#matter-canvas"),
      engine: this.engine,
      options: {
          width: 1000,
          height: 1000,
          pixelRatio: 1,
          background: 'transparent',
          wireframeBackground: 'transparent',
          hasBounds: false,
          enabled: true,
          wireframes: true,
          showSleeping: true,
          showDebug: false,
          showBroadphase: false,
          showBounds: true,
          showVelocity: false,
          showCollisions: false,
          showSeparations: false,
          showAxes: true,
          showPositions: false,
          showAngleIndicator: true,
          showIds: false,
          showShadows: false,
          showVertexNumbers: true,
          showConvexHulls: false,
          showInternalEdges: false,
          showMousePosition: false
      }
    })
    Render.run(this.render)
  }

}

export {MobileGameManager}