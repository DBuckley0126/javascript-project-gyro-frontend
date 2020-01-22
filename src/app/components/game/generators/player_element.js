import Matter from 'matter-js'
import {GameManager} from '../../../modules'

// module aliases
const Engine = Matter.Engine, World = Matter.World, Bodies = Matter.Bodies, Render = Matter.Render, Vertices = Matter.Vertices, Body = Matter.Body

class PlayerElement {
  constructor(x, y, scale, game){
    this.width = 278.000
    this.height = 339.000
    this.game = game
    this.moveX = 0
    this.moveY = -25
    this.scale = scale

    this.options = {
      friction: 0.3,
      restitution: 0.6,
      inertia: 'ifinity'
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


  get artificalMassCenter(){
    const artificalX = this.matterBody.position.x + (this.moveX * this.scale)
    const artificalY = this.matterBody.position.y + (this.moveY * this.scale)
    return {x: artificalX, y: artificalY}
  }

  get scaledAxisMove(){
    return {x:(this.moveX * this.scale), y:(this.moveY * this.scale)}
  }
  
  show(){
    this.game.sketch.push()
    this.game.sketch.translate(this.matterBody.position.x, this.matterBody.position.y)
    this.game.sketch.rotate(this.matterBody.angle)
    this.game.sketch.imageMode(this.game.sketch.CENTER)
    this.game.sketch.scale(this.scale)
    this.game.sketch.image(this.texture, this.scaledAxisMove['x'] , this.scaledAxisMove['y'], this.width, this.height)
    this.game.sketch.stroke('purple')
    this.game.sketch.strokeWeight(10)
    this.game.sketch.point(0, 0)
    this.game.sketch.pop()
  }
}

export {PlayerElement} 