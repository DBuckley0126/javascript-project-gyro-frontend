import Matter from 'matter-js'
import {GameManager, AstroidPartCElement, AstroidPartBElement, AstroidPartAElement} from '../../../modules'

const Engine = Matter.Engine, World = Matter.World, Bodies = Matter.Bodies, Render = Matter.Render, Vertices = Matter.Vertices, Body = Matter.Body, Constraint = Matter.Constraint

class DeconstructedAstroidGroup {
  constructor(originX, originY, scale, game){
    this.game = game
    this.scale = scale
    this.width = 0
    this.height = 0
    this.originX = originX
    this.originY = originY
    this.stiffness = 0.05
    this.damping = 0.01

    this.options = {
      frictionAir: 0,
      label: "deconstructedAstroidGroup"
    }
    this.verticesHash = Vertices.fromPath(GameManager.removeBrackets(this.game.elementVertices.completeAstroid.fixtures[0].hullPolygon))

    this.initAstroidParts()
    this.initConstraints()
  }

  initAstroidParts(){
    this.astroidPartAElement = new AstroidPartAElement(this.originX + (22 * this.scale), this.originY + (-138 * this.scale), this.scale, this.game)
    this.astroidPartBElement = new AstroidPartBElement(this.originX + (97 * this.scale), this.originY + (94 * this.scale), this.scale, this.game)
    this.astroidPartCElement = new AstroidPartCElement(this.originX + (-145 * this.scale), this.originY + (34 * this.scale), this.scale, this.game)
  }

  initConstraints(){
    this.constraintAB = Constraint.create({
      bodyA: this.astroidPartAElement.matterBody,
      pointA: { x: 0, y: 0 },
      bodyB: this.astroidPartBElement.matterBody,
      pointB: { x: 0, y: 0 },
      stiffness: this.stiffness,
      damping: this.damping,
      label: this.options.label
    })
    this.constraintBC = Constraint.create({
      bodyA: this.astroidPartBElement.matterBody,
      pointA: { x: 0, y: 0 },
      bodyB: this.astroidPartCElement.matterBody,
      pointB: { x: 0, y: 0 },
      stiffness: this.stiffness,
      damping: this.damping,
      label: this.options.label
    })
    this.constraintCA = Constraint.create({
      bodyA: this.astroidPartCElement.matterBody,
      pointA: { x: 0, y: 0 },
      bodyB: this.astroidPartAElement.matterBody,
      pointB: { x: 0, y: 0 },
      stiffness: this.stiffness,
      damping: this.damping,
      label: this.options.label
    })

    this.astroidPartAElement.constraintArray = [this.constraintAB, this.constraintBC, this.constraintCA]
    this.astroidPartBElement.constraintArray = [this.constraintAB, this.constraintBC, this.constraintCA]
    this.astroidPartCElement.constraintArray = [this.constraintAB, this.constraintBC, this.constraintCA]
    
    World.add(this.game.world, [this.constraintAB, this.constraintBC, this.constraintCA])
  }

}

export {DeconstructedAstroidGroup} 