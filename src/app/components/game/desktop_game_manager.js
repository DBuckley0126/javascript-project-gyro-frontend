import Matter from 'matter-js'
import * as p5 from 'p5'
import {GameManager} from '../../modules'

class DesktopGameManager extends GameManager{
  constructor(PageManager){
    super(PageManager)
    this.engine = null
    this.world = null
    this.boxes = []
    this.ground = null
    this.createGameInstance()
  }

  //
  // ─── EXTERNAL DATA INTERFACE ───────────────────────────────────────────────────────────────────────────
  //

  set connectionStatus(obj){
    this.connectionStatus = obj["connected"]
    this.activeStatus = obj["active"]
  }
}

export {DesktopGameManager}