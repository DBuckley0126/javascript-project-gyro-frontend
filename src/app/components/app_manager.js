import {DesktopPageManager, MobilePageManager} from '../modules'

class AppManager{

  constructor(container){
      this.container = container
      if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent)){
        this.MobilePageManager = new MobilePageManager(container)
      } else {
        this.DesktopPageManager = new DesktopPageManager(container)
      }
  }

}

export {AppManager}