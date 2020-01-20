import {GameManager} from '../../modules'

class MobileGameManager extends GameManager{

  // constructor(pageManager){
  //   super(pageManager)
  // }

  set connectionStatus(obj){
    this.connectionStatus = obj["connected"]
  }

}

export {MobileGameManager}