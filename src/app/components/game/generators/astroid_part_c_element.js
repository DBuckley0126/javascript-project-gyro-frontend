import Matter from 'matter-js'
import {GameManager, GeneralElement} from '../../../modules'

const Engine = Matter.Engine, World = Matter.World, Bodies = Matter.Bodies, Render = Matter.Render, Vertices = Matter.Vertices, Body = Matter.Body

class AstroidPartCElement extends GeneralElement {
  constructor(x, y, scale, game){
    super(scale, game)
    this.width = this.game.elementVertices.astroidPartC.size.width
    this.height = this.game.elementVertices.astroidPartC.size.height
    this.moveX = 0
    this.moveY = 0

    this.options = {
      frictionAir: 0,
      label: "astroidPartCElement"
    }
    this.verticesHash = Vertices.fromPath(GameManager.removeBrackets(this.game.elementVertices.astroidPartC.fixtures[0].hullPolygon))
    this.texture = this.game.textureContainer["astroidPartCImg"]
    this.produceMatter(x, y)
    this.container = this.game.astroidPartCElementContainer
    this.container.push(this)
  }

  produceMatter(x, y){
    this.matterBody = Bodies.fromVertices(x, y, this.verticesHash, this.options)
    Body.scale(this.matterBody, this.scale, this.scale, this.artificalMassCenter)
    World.add(this.game.world, this.matterBody)
    Body.setVelocity(this.matterBody, {x:0, y: 0})
  }

}

export {AstroidPartCElement} 