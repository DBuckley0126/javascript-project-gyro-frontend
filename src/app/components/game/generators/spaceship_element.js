import Matter from 'matter-js'
import {GameManager, GeneralElement} from '../../../modules'

// module aliases
const Engine = Matter.Engine, World = Matter.World, Bodies = Matter.Bodies, Render = Matter.Render, Vertices = Matter.Vertices, Body = Matter.Body

class SpaceshipElement extends GeneralElement {
  constructor(x, y, scale, game){
    super(scale, game)
    this.width = this.game.elementVertices.spaceship.size.width
    this.height = this.game.elementVertices.spaceship.size.height
    this.moveX = -20
    this.moveY = -100

    this.options = {
      isStatic: true,
      mass: Infinity,
      label: "spaceshipElement"
    }
    this.verticesHash = Vertices.fromPath(GameManager.removeBrackets(this.game.elementVertices.spaceship.fixtures[0].hullPolygon))
    this.texture = this.game.textureContainer["spaceshipImg"]
    this.produceMatter(x, y)
  }

  produceMatter(x, y){
    this.matterBody = Bodies.fromVertices(x, y, this.verticesHash, this.options)
    Body.scale(this.matterBody, this.scale, this.scale, this.artificalMassCenter)
    World.add(this.game.world, this.matterBody)
  }

  get gunPosition(){
    return {x: (this.artificalMassCenter["x"])+(0 * this.scale), y: (this.artificalMassCenter["y"])+(-150 * this.scale)}
  }
}

export {SpaceshipElement} 