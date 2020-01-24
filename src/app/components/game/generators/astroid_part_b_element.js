import Matter from 'matter-js'
import {GameManager, GeneralElement, ParticleRockDestroyPartGroup} from '../../../modules'

const Engine = Matter.Engine, World = Matter.World, Bodies = Matter.Bodies, Render = Matter.Render, Vertices = Matter.Vertices, Body = Matter.Body

class AstroidPartBElement extends GeneralElement {
  constructor(x, y, scale, game){
    super(scale, game)
    this.width = this.game.elementVertices.astroidPartB.size.width
    this.height = this.game.elementVertices.astroidPartB.size.height
    this.moveX = 10
    this.moveY = -2
    this.constraintArray = []
    this.lastTimeHit = 0
    this.health = 10

    this.options = {
      frictionAir: 0,
      label: "astroidPartBElement",
      setStatic: true
    }
    this.verticesHash = Vertices.fromPath(GameManager.removeBrackets(this.game.elementVertices.astroidPartB.fixtures[0].hullPolygon))
    this.texture = this.game.textureContainer["astroidPartBImg"]
    this.produceMatter(x, y)
    this.container = this.game.astroidPartBElementContainer
    this.container.push(this)
  }

  produceMatter(x, y){
    this.matterBody = Bodies.fromVertices(x, y, this.verticesHash, this.options)
    Body.scale(this.matterBody, this.scale, this.scale, this.artificalMassCenter)
    World.add(this.game.world, this.matterBody)
    Body.setVelocity(this.matterBody, {x:0, y: 0})
  }

  minusHealth(amount = 1){
    if(this.lastTimeHit < Date.now()-100){
      this.health = this.health - amount
      console.log(`Minus ${amount} health from astroid part`)
      console.log(this)
      this.lastTimeHit = Date.now()
      if(this.health <= 7){
        if(this.constraintArray.length !== 0){this.removeAllConstraints()}
      }
      if(this.health <= 0){
        const matterBodyX = this.matterBody.position.x
        const matterBodyY = this.matterBody.position.y
        this.remove()
        new ParticleRockDestroyPartGroup(matterBodyX, matterBodyY, this.scale, this.game)
      }
    }
  }

  removeAllConstraints(){
    World.remove(this.game.world, this.constraintArray)
  }

}

export {AstroidPartBElement} 