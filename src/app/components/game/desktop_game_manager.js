import {GameManager} from '../../modules'

class DesktopGameManager extends GameManager{

  set connectionStatus(obj){
    this.connectionStatus = obj["connected"]
    this.activeStatus = obj["active"]
  }
}

export {DesktopGameManager}