import Matter from 'matter-js'
import {GameManager, GeneralElement} from '../../../modules'

const Engine = Matter.Engine, World = Matter.World, Bodies = Matter.Bodies, Render = Matter.Render, Vertices = Matter.Vertices, Body = Matter.Body

class AstroidPartBElement extends GeneralElement {
  constructor(x, y, scale, game){
    super(scale, game)
    this.width = this.game.elementVertices.astroidPartB.size.width
    this.height = this.game.elementVertices.astroidPartB.size.height
    this.moveX = 10
    this.moveY = -2

    this.options = {
      frictionAir: 0,
      label: "astroidPartBElement"
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

}

export {AstroidPartBElement} 