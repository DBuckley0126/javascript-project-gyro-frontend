import Matter from 'matter-js'
import {GameManager, GeneralElement} from '../../../modules'

const Engine = Matter.Engine, World = Matter.World, Bodies = Matter.Bodies, Render = Matter.Render, Vertices = Matter.Vertices, Body = Matter.Body

class AstroidPartAElement extends GeneralElement {
  constructor(x, y, scale, game){
    super(scale, game)
    this.width = this.game.elementVertices.astroidPartA.size.width
    this.height = this.game.elementVertices.astroidPartA.size.height
    this.moveX = -17
    this.moveY = 5

    this.options = {
      frictionAir: 0,
      label: "astroidPartAElement"
    }
    this.verticesHash = Vertices.fromPath(GameManager.removeBrackets(this.game.elementVertices.astroidPartA.fixtures[0].hullPolygon))
    this.texture = this.game.textureContainer["astroidPartAImg"]
    this.produceMatter(x, y)
    this.container = this.game.astroidPartAElementContainer
    this.container.push(this)
  }

  produceMatter(x, y){
    this.matterBody = Bodies.fromVertices(x, y, this.verticesHash, this.options)
    Body.scale(this.matterBody, this.scale, this.scale, this.artificalMassCenter)
    World.add(this.game.world, this.matterBody)
    Body.setVelocity(this.matterBody, {x:0, y: 0})
  }

}

export {AstroidPartAElement} 