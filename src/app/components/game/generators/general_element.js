import Matter from 'matter-js'
import {GameManager} from '../../../modules'

// module aliases
const Engine = Matter.Engine, World = Matter.World, Bodies = Matter.Bodies, Render = Matter.Render, Vertices = Matter.Vertices, Body = Matter.Body

class GeneralElement {
  constructor(scale, game){
    this.game = game
    this.scale = scale
  }

  get artificalMassCenter(){
    const artificalX = this.matterBody.position.x + (this.moveX * this.scale)
    const artificalY = this.matterBody.position.y + (this.moveY * this.scale)
    return {x: artificalX, y: artificalY}
  }

  scaledAxisMove(addonX = 0, addonY = 0){
    return {x:((this.moveX + addonX) * this.scale), y:((this.moveY + addonY) * this.scale)}
  }
  
  show(){
    this.game.sketch.push()
    this.game.sketch.translate(this.matterBody.position.x, this.matterBody.position.y)
    this.game.sketch.rotate(this.matterBody.angle)
    this.game.sketch.imageMode(this.game.sketch.CENTER)
    this.game.sketch.scale(this.scale)
    this.game.sketch.image(this.texture, this.scaledAxisMove()['x'] , this.scaledAxisMove()['y'], this.width, this.height)
    this.game.sketch.stroke('purple')
    this.game.sketch.strokeWeight(10)
    this.game.sketch.point(0, 0)
    this.game.sketch.pop()
  }
}

export {GeneralElement} 