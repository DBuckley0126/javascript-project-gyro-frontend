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

// MODULE ALIASES
const Engine = Matter.Engine, World = Matter.World, Bodies = Matter.Bodies, Render = Matter.Render, Vertices = Matter.Vertices, Body = Matter.Body, Composite = Matter.Composite, Events = Matter.Events

class DesktopGameManager extends GameManager{

  constructor(PageManager){
    super(PageManager)
    this.initBindingsAndEventListeners()
    this.currentWindowWidth = window.innerWidth
    this.currentWindowHight = window.innerHeight
    this._axisX = 0
    this._axisY = 0
    this._axisZ = 0
    this.engine = null
    this.world = null
    this.bonusScore = 0
    this.spawnerEngine = {
      lastTimeDeconstructedAstroidGroupSpawned: Date.now() - 8000,
    }
    this.elementVertices = elementVerticesJSON.default
    this.initElementContainers()
    this.textureContainer = {}
    this.createGameInstance()
  }

  //
  // ─── EXTERNAL DATA INTERFACE ───────────────────────────────────────────────────────────────────────────
  //

  connectionStatus(obj){
    this.connection = obj["connection"]
    this.activeStatus = obj["active"]
  }


  //
  // ─── INSTANCE HELPER FUNCTIONS ───────────────────────────────────────────────────────────────────────────
  //

  initBindingsAndEventListeners(){
    // Set AppManagers attributes to HTML elements
    this.container = document.querySelector("#desktop-game-container")
    this.scoreDisplay = this.container.querySelector("#desktop-game-score-display")
    this.endScene = this.container.querySelector("#desktop-game-end-scene")
    this.endSceneScore = this.container.querySelector("#desktop-game-end-scene-score")
    this.exitGameButton = this.container.querySelector("#desktop-game-end-scene-exit-button")
    
    
    // Initialise listeners
    this.initWindowResizeListener()
    this.initExitButtonListener()
    
    return Promise.resolve("Finished setting bindings and listeners")
  }

  initExitButtonListener(){
    this.exitGameButton.addEventListener('click', function(){
      this.destroyAndHideGame()
    }.bind(this))
  }

  initWindowResizeListener(){
    window.addEventListener("resize", function(event){
      console.log("resize window active")
      this.currentWindowWidth = window.innerWidth
      this.currentWindowHight = window.innerHeight
      this.sketch.resizeCanvas(this.currentWindowWidth, this.currentWindowHight)
      this.world.bounds = {min:{x: -200 ,y: -400}, max: {x: this.currentWindowWidth + 200, y: this.currentWindowHight + 200}}
    }.bind(this))
  }

  destroyAndHideGame(){
    Engine.clear(this.engine)
    this.sketch.remove()
    this.endScene.style.display = "none"
    this.container.style.display = "none"
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

  endGame(){

    this.finalScore = this.overallScore
    this.scoreDisplay.style.display = "none"
    this.endSceneScore.innerText = this.finalScore
    this.endScene.style.display = "block"
    console.log("game ended")
  }


  //
  // ─── MATTER + P5 ───────────────────────────────────────────────────────────────────────────
  //

  createGameInstance(){
    this.P5engine = new p5((sketch) => {this.initSketchInstance(sketch)}, this.container.querySelector('#desktop-game-canvas'))
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
      this.world.bounds = {min:{x: -200 ,y: -400}, max: {x: this.currentWindowWidth + 200, y: this.currentWindowHight + 400}}
      this.spaceship = new SpaceshipElement(this.currentWindowWidth / 2, this.currentWindowHight - 110, 0.5, this)
      this.lastTimeGunFired = 0
      this.scoreDisplay.style.display = "block"

      // Unhighlight below to activate Matter.js developer canvas
      // this.produceDevCanvas()
      this.initIntervalCleanUp()
      this.initCollisionDetection()
      this.container.style.display = "block"
    }
  }

  draw(){
    this.sketch.draw = () =>{
      Engine.update(this.engine)
      this.currentFrameCount = this.sketch.frameCount
      this.sketch.push()
      this.sketch.background('#141414')
      this.sketch.pop()
      this.showElements()
      this.updateScore()
      this.spawnerEngineUpdate()

      this.reactToMovementControl()
      this.reactToGunControl()
    }
  }

  //
  // ─── DRAW FUNCTIONS ───────────────────────────────────────────────────────────────────────────
  //

  showElements(){
    const elementArray = ['bulletElement', 'completeAstroidElement', 'astroidPartAElement', 'astroidPartBElement', 'astroidPartCElement', 'particleRockElement']
    if(this.spaceship.exploded == false){this.spaceship.show()}
    
    // loops over containers listed in elementArray
    for(const elementName of elementArray){
      const container = this[`${elementName}Container`]
      for(const element of container){
        element.show()
      }
    }
  }

  updateScore(){
    this.timeScore = Math.floor( this.currentFrameCount / 10 )
    this.overallScore = this.timeScore + this.bonusScore
    this.scoreDisplay.innerText = this.overallScore
  }

    

  reactToMovementControl(){
    const axisMovementPercentage = this._axisX / 180

    const xTargetPositionInWindow = this.currentWindowWidth * axisMovementPercentage
    let moveX = this.spaceship.matterBody.position.x
    if(xTargetPositionInWindow < this.spaceship.matterBody.position.x - 10){
      moveX = this.spaceship.matterBody.position.x - 10
    } else if (xTargetPositionInWindow > this.spaceship.matterBody.position.x + 10){
      moveX = this.spaceship.matterBody.position.x + 10
    }

    Body.setVelocity(this.spaceship.matterBody, {x: moveX, y: + 100})
    Body.setPosition(this.spaceship.matterBody, {x: moveX, y: this.spaceship.matterBody.position.y})
  }

  reactToGunControl(){
    if(this._axisY <= 42 && this.lastTimeGunFired < Date.now() - 250 && this.spaceship.exploded === false){
      new BulletElement(this.spaceship.gunPosition["x"], this.spaceship.gunPosition["y"], 1, this)
      this.lastTimeGunFired = Date.now()
    }
  }

  initIntervalCleanUp(){
    setInterval(function(){
      const context = this
      let outsideWorldContainer = Matter.Query.region(Composite.allBodies(context.world), context.world.bounds, {outside: true})
      for(const matterBody of outsideWorldContainer){
        context.findBodyMatchingElement(matterBody, true)
      }
      Composite.remove(context.world, outsideWorldContainer)
    }.bind(this), 1000)
  }

  initCollisionDetection(context = this){
    Events.on(this.engine, 'collisionStart', function(event){
      const pairsArray = event.pairs;


      for( const pair of pairsArray ){
        // Checks if spaceship has been hit by astroid part A/B/C
        if(context.collisionSpaceshipAndAstroidPart(pair)){
          context.spaceship.remove()
          context.spaceship.exploded = true
          context.endGame()
        }
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

    // Checks if pair contains a matterBody for a astroid part A/B/C and spaceship
    collisionSpaceshipAndAstroidPart(pair){
      let pairContainsSpaceship = false
      let astroidPartMatterBody = null
      //Checks if pair contains a matterBody for a astroid part A/B/C
      if(pair.bodyA.label === "astroidPartAElement" || pair.bodyA.label ===  "astroidPartBElement" || pair.bodyA.label === "astroidPartCElement"){
        astroidPartMatterBody = pair.bodyA
      } else if(pair.bodyB.label === "astroidPartAElement" || pair.bodyB.label === "astroidPartBElement" || pair.bodyB.label === "astroidPartCElement"){
        astroidPartMatterBody = pair.bodyB
      }
      // Checks if pair contains a matterBody for a bulletElement
      if(pair.bodyA.label == "spaceshipElement" || pair.bodyB.label == "spaceshipElement"){
        pairContainsSpaceship = true
      }
      // If pair contains spaceship and Astroid part, return the body of astroid part
      if(astroidPartMatterBody && pairContainsSpaceship){
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

  spawnerEngineUpdate(){
    const leftBoundry = 0
    const rightBoundry = this.currentWindowWidth
    Object.assign(this.spawnerEngine, {
      difficultyMultipler: 1 * (this.currentFrameCount / 2000) + 1
    })
    if(this.spawnerEngine.lastTimeDeconstructedAstroidGroupSpawned < Date.now() - (8000 / (this.spawnerEngine.difficultyMultipler))){
      const randomX = GameManager.randomInt(leftBoundry, rightBoundry)
      const randomScale = (GameManager.randomInt(20, 40)) / 100
      const velocityMultiplier = (this.spawnerEngine.difficultyMultipler / 2) + 1
      new DeconstructedAstroidGroup(randomX, -200, randomScale, this, velocityMultiplier)
      this.spawnerEngine.lastTimeDeconstructedAstroidGroupSpawned = Date.now()
    }
  }

  //
  // ─── DEVELOPMENT CANVAS ───────────────────────────────────────────────────────────────────────────
  //

  produceDevCanvas(){
    this.render = Render.create({
      element: this.container.querySelector("#desktop-matter-developer-canvas"),
      engine: this.engine,
      options: {
          width: this.currentWindowWidth,
          height: this.currentWindowHight,
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

export {DesktopGameManager}