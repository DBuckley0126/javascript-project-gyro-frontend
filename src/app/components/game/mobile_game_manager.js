global.decomp = require('poly-decomp');

import Matter, { Query } from 'matter-js'
import * as p5 from 'p5'
import {GameManager, BoxElement, SpaceshipElement, BulletElement, CompleteAstroidElement, AstroidPartAElement, AstroidPartBElement, AstroidPartCElement, DeconstructedAstroidGroup, ParticleRockElement, ParticleRockDestroyPartGroup} from '../../modules'
import * as elementVerticesJSON from '../../../../assets/json/gyro_element_vertices.json'

// IMAGES
import spaceshipImgURL from '../../../../assets/img/spaceship.png'
import bulletImgURL from '../../../../assets/img/bullet.png'
import completeAstroidImgURL from '../../../../assets/img/complete-astroid.png'
import astroidPartAImgURL from '../../../../assets/img/astroid-part-a.png'
import astroidPartBImgURL from '../../../../assets/img/astroid-part-b.png'
import astroidPartCImgURL from '../../../../assets/img/astroid-part-c.png'
import particleRockImgURL from '../../../../assets/img/particle-rock.png'

// module aliases
const Engine = Matter.Engine, World = Matter.World, Bodies = Matter.Bodies, Render = Matter.Render, Vertices = Matter.Vertices, Body = Matter.Body, Composite = Matter.Composite, Events = Matter.Events

class MobileGameManager extends GameManager{

  constructor(PageManager){
    super(PageManager)
    this.initBindingsAndEventListeners()
    this._axisX = 0
    this._axisY = 0
    this._axisZ = 0
    this.gunButtonPressed = false
    this.engine = null
    this.world = null
    this.initElementContainers()
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
  // ─── INSTANCE HELPER FUNCTIONS ───────────────────────────────────────────────────────────────────────────
  //

  initBindingsAndEventListeners(){
    // Set AppManagers attributes to HTML elements
    this.container = document.querySelector("#mobile-game-container")
    this.scoreDisplay = this.container.querySelector("#mobile-game-score-display")
    
    // Initialise listeners
    
    return Promise.resolve("Finished setting bindings and listeners")
  }

  findBodyMatchingElement(matterBody, remove = false){
    const container = this[`${matterBody.label}Container`]

    if(!container){
      console.log(matterBody.label)
      return console.log("There is no container for this element ^^^")
    }

    const foundElement = container.find(element => element.containsMatterBody(matterBody))
    if(foundElement){
      if(remove){foundElement.remove()}
      return foundElement
    } else {
      console.log(matterBody)
      console.log("matterBody not found in matching container")
      console.log(container)
    }
  }

  initElementContainers(){
    this.bulletElementContainer = []
    this.completeAstroidElementContainer = []
    this.astroidPartAElementContainer = []
    this.astroidPartBElementContainer = []
    this.astroidPartCElementContainer = []
    this.particleRockElementContainer = []
  }


  //
  // ─── MATTER + P5 ───────────────────────────────────────────────────────────────────────────
  //

  createGameInstance(){
    this.P5engine = new p5((sketch) => {this.initSketchInstance(sketch)}, this.container.querySelector('#mobile-game-canvas'))
  }

  initSketchInstance(sketch){
    this.sketch = sketch
    this.preload()
    this.setup()
    this.draw()
  }

  preload(){
    this.sketch.preload = () => {
      Object.assign(this.textureContainer, 
        {spaceshipImg: this.sketch.loadImage(spaceshipImgURL)}, 
        {bulletImg: this.sketch.loadImage(bulletImgURL)}, 
        {completeAstroidImg: this.sketch.loadImage(completeAstroidImgURL)},
        {astroidPartAImg: this.sketch.loadImage(astroidPartAImgURL)},
        {astroidPartBImg: this.sketch.loadImage(astroidPartBImgURL)},
        {astroidPartCImg: this.sketch.loadImage(astroidPartCImgURL)},
        {particleRockImg: this.sketch.loadImage(particleRockImgURL)},
      )
    }
  }

  setup(){
    this.sketch.setup = () =>{
      this.sketch.createCanvas(window.innerWidth, window.innerHeight)
      this.sketch.background(40)
      this.sketch.frameRate(60)
      this.engine = Engine.create({constraintIterations: 4})
      this.world = this.engine.world
      this.world.gravity.y = 0
      this.world.bounds = {min:{x: -500 ,y: -500}, max: {x: window.innerWidth + 500, y: window.innerHeight + 500}}
      this.spaceship = new SpaceshipElement(500, 800, 0.5, this)
      this.lastTimeGunFired = 0

      this.deconstructedAstroidGroup = new DeconstructedAstroidGroup(500, 200, 0.3, this)

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
      this.showScore()
      this.sketch.pop()
      this.showElements()

      this.reactToMovementControl()
      this.reactToGunControl()

    }
  }

  //
  // ─── DRAW FUNCTIONS ───────────────────────────────────────────────────────────────────────────
  //

  showElements(){
    const elementArray = ['bulletElement', 'completeAstroidElement', 'astroidPartAElement', 'astroidPartBElement', 'astroidPartCElement', 'particleRockElement']
    this.spaceship.show()
    
    // loops over containers listed in elementArray
    for(const elementName of elementArray){
      const container = this[`${elementName}Container`]
      for(const element of container){
        element.show()
      }
    }
  }

  showScore(){
    let currentFrameCount = this.sketch.frameCount

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

  initIntervalCleanUp(){
    setInterval(function(){
      const context = this.game
      let outsideWorldContainer = Matter.Query.region(Composite.allBodies(context.world), context.world.bounds, {outside: true})
      for(const matterBody of outsideWorldContainer){
        context.findBodyMatchingElement(matterBody, true)
      }
      Composite.remove(context.world, outsideWorldContainer)
    }, 1000)
  }

  initCollisionDetection(context = this){
    Events.on(this.engine, 'collisionStart', function(event){
      const pairsArray = event.pairs;


      for( const pair of pairsArray ){
        // Checks if pair contains a matterBody for a astroid part A/B/C and bullet, returns matterBody of astroid part or false
        const matterBodyForAstroidPart = context.collisionBulletAndAstroidPart(pair)
        // Checks if pair contains a matterBody for a  bullet, returns matterBody of bullet or false
        const matterBodyForBullet = context.collisonBullet(pair)

        // Checks if pair contains a matterBody for a astroid part A/B/C and bullet
        if (matterBodyForAstroidPart){
          const matchingElement = context.findBodyMatchingElement(matterBodyForAstroidPart)
          if(matchingElement){matchingElement.minusHealth()}
        }

        // Checks if pair contains a matterBody for a bullet
        if (matterBodyForBullet){
          const matterBodyPositionX = matterBodyForBullet.position.x
          const matterBodyPositionY = matterBodyForBullet.position.y
          context.findBodyMatchingElement(matterBodyForBullet, true)
          new ParticleRockDestroyPartGroup(matterBodyPositionX, matterBodyPositionY, 0.1, context, true, 1000, 2, 5)
        }
      }

    })
  }

  //
  // ─── COLLISION QUERY HELPERS ───────────────────────────────────────────────────────────────────────────
  //

  // Checks if pair contains a matterBody for a astroid part A/B/C and bullet
  collisionBulletAndAstroidPart(pair){
    let pairContainsBullet = false
    let astroidPartMatterBody = null
    //Checks if pair contains a matterBody for a astroid part A/B/C
    if(pair.bodyA.label === "astroidPartAElement" || pair.bodyA.label ===  "astroidPartBElement" || pair.bodyA.label === "astroidPartCElement"){
      astroidPartMatterBody = pair.bodyA
    } else if(pair.bodyB.label === "astroidPartAElement" || pair.bodyB.label === "astroidPartBElement" || pair.bodyB.label === "astroidPartCElement"){
      astroidPartMatterBody = pair.bodyB
    }
    // Checks if pair contains a matterBody for a bulletElement
    if(pair.bodyA.label == "bulletElement" || pair.bodyB.label == "bulletElement"){
      pairContainsBullet = true
    }
    // If pair contains bullet and Astroid part, return the body of astroid part
    if(astroidPartMatterBody && pairContainsBullet){
      return astroidPartMatterBody
    } else {
      return false
    }
  }
  
  // Checks if pair contains a matterBody for a bullet
  collisonBullet(pair){
    let bulletMatterBody = null
    if (pair.bodyA.label == "bulletElement"){
      bulletMatterBody = pair.bodyA
    } else if (pair.bodyB.label == "bulletElement"){
      bulletMatterBody = pair.bodyB
    }

    if (bulletMatterBody){
      return bulletMatterBody
    } else {
      return false
    }
  }

  //
  // ─── SPAWNER ENGINE ───────────────────────────────────────────────────────────────────────────
  //

  initSpawnerEngine(){

  }

  randomBoxDrop(ms){
    setInterval((context = this)=>{
      const x = GameManager.randomInt(100,900)
      const y = 100
      const particleRockElement = new ParticleRockDestroyPartGroup(x, y, 0.5, context)
    }, ms)
  }

  //
  // ─── DEVELOPMENT CANVAS ───────────────────────────────────────────────────────────────────────────
  //

  produceDevCanvas(){
    this.render = Render.create({
      element: this.container.querySelector("#mobile-game-canvas"),
      engine: this.engine,
      options: {
          width: window.innerWidth,
          height: window.innerHeight,
          pixelRatio: 1,
          background: 'transparent',
          wireframeBackground: 'transparent',
          hasBounds: false,
          enabled: true,
          wireframes: true,
          showSleeping: false,
          showDebug: false,
          showBroadphase: false,
          showBounds: false,
          showVelocity: true,
          showCollisions: true,
          showSeparations: false,
          showAxes: false,
          showPositions: true,
          showAngleIndicator: false,
          showIds: false,
          showShadows: false,
          showVertexNumbers: false,
          showConvexHulls: false,
          showInternalEdges: false,
          showMousePosition: false
      }
    })
    Render.run(this.render)
  }

}

export {MobileGameManager}