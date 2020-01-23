import Matter from 'matter-js'
import {GameManager} from '../../../modules'

// module aliases
const Engine = Matter.Engine, World = Matter.World, Bodies = Matter.Bodies, Render = Matter.Render, Vertices = Matter.Vertices, Body = Matter.Body, Composite = Matter.Composite

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

  get index(){
    if(this.container){
      return this.container.indexOf(this)
    } else {
      console.log("ERROR: This object has no container array")
    }
  }

  remove(){
    if(this.container){
      Composite.remove(this.game.world, this.matterBody)
      const removedElementsArray = this.container.splice(this.index, 1)
      console.log("Removed " + removedElementsArray[0].constructor.name)
      return removedElementsArray[0]
    } else {
      Composite.remove(this.game.world, this.matterBody)
      console.log("Removed from world but not from container array")
      return this
    }
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