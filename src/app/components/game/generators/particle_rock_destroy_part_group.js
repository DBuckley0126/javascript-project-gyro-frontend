import Matter from 'matter-js'
import {GameManager, ParticleRockElement} from '../../../modules'

const Engine = Matter.Engine, World = Matter.World, Bodies = Matter.Bodies, Render = Matter.Render, Vertices = Matter.Vertices, Body = Matter.Body, Constraint = Matter.Constraint

class ParticleRockDestroyPartGroup {
  constructor(originX, originY, scale, game, timeout = true, timeoutMs = 20000, minParticles = 5, maxParticles = 10){
    this.game = game
    this.scale = scale
    this.width = 0
    this.height = 0
    this.originX = originX
    this.originY = originY
    this.particleRockElementArray = []
    this.timeout = timeout
    this.timeoutMs = timeoutMs
    this.minParticles = minParticles
    this.maxParticles = maxParticles

    this.options = {
      frictionAir: 0,
      label: "particleRockDestroyPartGroup"
    }
    
    this.initParticleRocks()
  }

  initParticleRocks(){
    const numberOfParticles = GameManager.randomInt(this.minParticles, this.maxParticles)

    for(let i = 0; i < numberOfParticles; i++){
      let randomMoveX = GameManager.randomInt(-50, 50)
      let randomMoveY = GameManager.randomInt(-50, 50)
      const particleRockElement = new ParticleRockElement(this.originX + (randomMoveX), this.originY + (randomMoveY), this.randomScale(2), this.game, this.timeout, this.timeoutMs)
      this.particleRockElementArray.push(particleRockElement)
      let positionVelocityX = 0
      let positionVelocityY = 0
      if(Math.sign(randomMoveX) == 1){
        positionVelocityX = 1
      } else {
        positionVelocityX = -1
      }

      if(Math.sign(randomMoveY) == 1){
        positionVelocityY = 1
      } else {
        positionVelocityY = -1
      }

      Body.setVelocity(particleRockElement.matterBody, {x:positionVelocityX, y: positionVelocityY})
    }

  }

  randomScale(scaleRangeMultipler = 2){
    const bottomScale = this.scale / scaleRangeMultipler
    const topScale = this.scale * scaleRangeMultipler
    return (GameManager.randomInt(bottomScale * 10, topScale * 10)) / 10
  }
}

export {ParticleRockDestroyPartGroup} 