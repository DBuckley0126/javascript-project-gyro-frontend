import Matter from 'matter-js'
import {GameManager, GeneralElement} from '../../../modules'

// module aliases
const Engine = Matter.Engine, World = Matter.World, Bodies = Matter.Bodies, Render = Matter.Render, Vertices = Matter.Vertices, Body = Matter.Body

class CompleteAstroidElement extends GeneralElement {
  constructor(x, y, scale, game){
    super(scale, game)
    this.width = this.game.elementVertices.completeAstroid.size.width
    this.height = this.game.elementVertices.completeAstroid.size.height
    this.moveX = 0
    this.moveY = 0

    this.options = {
      frictionAir: 0,
      label: "completeAstroidElement"
    }
    this.verticesHash = Vertices.fromPath(GameManager.removeBrackets(this.game.elementVertices.completeAstroid.fixtures[0].hullPolygon))
    this.texture = this.game.textureContainer["completeAstroidImg"]
    this.produceMatter(x, y)
    this.game.completeAstroidElementContainer.push(this)
    this.container = this.game.completeAstroidElementContainer
  }

  produceMatter(x, y){
    this.matterBody = Bodies.fromVertices(x, y, this.verticesHash, this.options)
    Body.scale(this.matterBody, this.scale, this.scale, this.artificalMassCenter)
    World.add(this.game.world, this.matterBody)
    Body.setVelocity(this.matterBody, {x:0, y: 1})
  }

}

export {CompleteAstroidElement} 