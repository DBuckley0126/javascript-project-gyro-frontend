import GameManger from './game_manager'

import {} from '../modules'

class AppManager{

  constructor(container){
      this.container = container

      if(this.checkController){
        this.MobilePageManager = new MobilePageManager(container)
      } else {
        this.DesktopPageManager = new DesktopPageManager(container)
      }

      this.initBindingsAndEventListeners()
      // this.massSelector = new MassSelector()
      // this.universe = new Universe()
      // this.universe.addMassCallback = this.universeAddMassCallback.bind(this)
  }

  get checkController(){
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }


  initBindingsAndEventListeners(){

  }

  universeAddMassCallback(){
      return this.massSelector.selectedMass
  }
}

export class {AppManager}