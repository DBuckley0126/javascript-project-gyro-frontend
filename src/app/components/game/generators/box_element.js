import Matter from 'matter-js'
// module aliases
const Engine = Matter.Engine, World = Matter.World, Bodies = Matter.Bodies;

class BoxElement {
  constructor(x, y, w, h, game){
    this.options = {
      friction: 0.3,
      restitution: 0.6,
      label: "box"
    }
    this.matterBody = Bodies.rectangle(x, y, w, h, this.options)
    this.width = w
    this.height = h
    this.game = game
    World.add(game.world, this.matterBody)
  }

  show(){
    const pos = this.matterBody.position
    const angle = this.matterBody.angle
    
    this.game.sketch.push()
    this.game.sketch.translate(pos.x, pos.y)
    this.game.sketch.rotate(angle)
    this.game.sketch.rectMode(this.game.sketch.CENTER)
    this.game.sketch.strokeWeight(1)
    this.game.sketch.stroke(255)
    this.game.sketch.fill(127)
    this.game.sketch.rect(0, 0, this.width, this.height)
    this.game.sketch.pop()
  }
}

export {BoxElement}