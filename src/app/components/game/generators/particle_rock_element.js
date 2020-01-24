import Matter from 'matter-js'
import {GameManager, GeneralElement} from '../../../modules'

// module aliases
const Engine = Matter.Engine, World = Matter.World, Bodies = Matter.Bodies, Render = Matter.Render, Vertices = Matter.Vertices, Body = Matter.Body

class ParticleRockElement extends GeneralElement {
  constructor(x, y, scale, game, timeout = true, timeoutMs = 10000){
    super(scale, game)
    this.width = this.game.elementVertices.particleRock.size.width
    this.height = this.game.elementVertices.particleRock.size.height
    this.moveX = 0
    this.moveY = 0
    this.timeout = timeout
    this.timeoutMs = timeoutMs

    this.options = {
      frictionAir: 0,
      label: "particleRockElement"
    }
    this.verticesHash = Vertices.fromPath(GameManager.removeBrackets(this.game.elementVertices.particleRock.fixtures[0].hullPolygon))
    this.texture = this.game.textureContainer["particleRockImg"]
    this.produceMatter(x, y)
    this.container = this.game.particleRockElementContainer
    this.container.push(this)

    if (this.timeout){
      this.deleteElementAfterTimeout(this.randomMs())
    }
  }

  produceMatter(x, y){
    this.matterBody = Bodies.fromVertices(x, y, this.verticesHash, this.options)
    Body.scale(this.matterBody, this.scale, this.scale, this.artificalMassCenter)
    Body.rotate(this.matterBody, GameManager.randomInt(0, 360))
    World.add(this.game.world, this.matterBody)
  }

  deleteElementAfterTimeout(ms){
    const context = this
    setTimeout(function(context){
      context.remove()
    }, ms, context)
  }

  randomMs(msRangeMultipler = 2){
    const bottomScale = this.timeoutMs / msRangeMultipler
    const topScale = this.scale * msRangeMultipler
    return GameManager.randomInt(bottomScale, topScale)
  }

}

export {ParticleRockElement} 