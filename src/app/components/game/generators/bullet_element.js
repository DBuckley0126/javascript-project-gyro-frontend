import Matter from 'matter-js'
import {GameManager, GeneralElement} from '../../../modules'

// module aliases
const Engine = Matter.Engine, World = Matter.World, Bodies = Matter.Bodies, Render = Matter.Render, Vertices = Matter.Vertices, Body = Matter.Body

class BulletElement extends GeneralElement {
  constructor(x, y, scale, game){
    super(scale, game)
    this.radius = 10
    this.width = 40
    this.height = 40
    this.moveX = 0
    this.moveY = 0

    this.options = {
      frictionAir: 0,
      label: "BulletElement"
    }
    this.texture = this.game.textureContainer["bulletImg"]
    this.produceMatter(x, y)
    this.game.bulletElementsContainer.push(this)
    this.container = this.game.bulletElementsContainer
  }

  produceMatter(x, y){
    this.matterBody = Bodies.circle(x, y, this.radius, this.options)
    Body.scale(this.matterBody, this.scale, this.scale, this.artificalMassCenter)
    World.add(this.game.world, this.matterBody)
    Body.setVelocity(this.matterBody, {x:0, y: - 20})
  }

}

export {BulletElement} 
