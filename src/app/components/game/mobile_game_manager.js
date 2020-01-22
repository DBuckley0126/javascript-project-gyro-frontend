global.decomp = require('poly-decomp');

import Matter from 'matter-js'
import * as p5 from 'p5'
import {GameManager, BoxElement, PlayerElement, BulletElement} from '../../modules'
import * as elementVerticesJSON from '../../../../assets/json/gyro_element_vertices.json'

// IMAGES
import spaceshipImgURL from '../../../../assets/img/spaceship.png'


// module aliases
const Engine = Matter.Engine, World = Matter.World, Bodies = Matter.Bodies, Render = Matter.Render, Vertices = Matter.Vertices, Body = Matter.Body

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
    this.bulletsContainer = []
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
      Object.assign(this.textureContainer, {spaceshipImg: this.sketch.loadImage(spaceshipImgURL)})
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
      this.ground = Bodies.rectangle(500, 900, 1000, 200, {isStatic: true})
      this.player = new PlayerElement(500, 800, 0.5, this)
      this.ground.label = "ground"
      this.lastTimeGunFired = 0

      World.add(this.world, [this.ground])
      this.randomBoxDrop(2000)
      this.produceDevCanvas()
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
      this.player.show()
      // this.sketch.translate(this.player.body.position.x, this.player.body.position.y)

      // this.sketch.beginShape()
      // for(const vertexObj of this.player.verticesHash){
      //   this.sketch.vertex(vertexObj.x, vertexObj.y)
      // }
      // this.sketch.endShape(this.sketch.CLOSE)

      this.reactToMovementControl()
      this.reactToGunControl()

      this.boxes.forEach((box) => {
        box.show()
      })
      this.clearUp()
    }
  }

  reactToMovementControl(){
    const startingPoint = 500
    const movementMultiplier = this._axisX * 10
    const px = startingPoint + movementMultiplier
    Body.setVelocity(this.player.matterBody, {x: px - this.player.matterBody.position.x, y: 0})
    Body.setPosition(this.player.matterBody, {x: px, y: this.player.matterBody.position.y})
  }

  reactToGunControl(){
    
    if(this.gunButtonPressed && this.lastTimeGunFired < Date.now() - 500){
      const bullet = new BulletElement(this.player.gunPosition["x"], this.player.gunPosition["y"], 1, this)
      this.lastTimeGunFired = Date.now()
      this.bulletsContainer.push(bullet)
    }
  }

  randomBoxDrop(ms){
    setInterval((context = this)=>{
      const x = GameManager.randomInt(100,900)
      const y = 100
      const box = new BoxElement(x, y, 100, 100, context)
      context.boxes.push(box)
    }, ms)
  }

  clearUp(){
    for( const bullet in )
    this.bulletsContainer.
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