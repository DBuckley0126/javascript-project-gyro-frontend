import {DesktopPageManager, MobilePageManager} from '../modules'

class AppManager{

  constructor(container){
    this.container = container
    this.initBindingsAndEventListeners()

    
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent)){
      this.PageManager = new MobilePageManager(container)
      this.deviceType = "mobile"
    } else {
      this.PageManager = new DesktopPageManager(container)
      this.deviceType = "desktop"
    }

  }

  initBindingsAndEventListeners(){
    // Set AppManagers attributes to HTML elements
    this.fullscreenReqestButton = this.container.querySelector(".fullscreen-request-button")
    this.alert = this.container.querySelector("#app-alert")

    // Initialise listeners
    this.addFullscreenRequestButtonListener()

    return Promise.resolve("Finished setting bindings and listeners")
  }

  // Listeners
  addFullscreenRequestButtonListener(context = this){
    this.fullscreenReqestButton.addEventListener('click', function(event){
      console.log("Fullscreen button pressed")
      async function fullScreenLock(){
        try{
          await context.openFullscreen(context.container)
          console.log("Fullscreen granted")
          if(context.deviceType === "mobile"){
            await screen.orientation.lock("portrait-primary")
            console.log("Mobile screen orientation locked")
          } 

        }catch(error){
          context.failureNotice(error)
        }
      }
      fullScreenLock()
    })
  }  

  // Request fullscreen from browser
  openFullscreen(element) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
      return Promise.resolve("Request fullscreen granted")
    } else if (element.mozRequestFullScreen) { /* Firefox */
      element.mozRequestFullScreen();
      return Promise.resolve("Request fullscreen granted")
    } else if (element.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
      element.webkitRequestFullscreen();
      return Promise.resolve("Request fullscreen granted")
    } else if (element.msRequestFullscreen) { /* IE/Edge */
      element.msRequestFullscreen();
      return Promise.resolve("Request fullscreen granted")
    } else {
      return Promise.reject("Request fullscreen denied")
    }
  }

    // User notices/warnings
    failureNotice(error = {type:"undefiend", statusText: "Failure Unknown"}){
      console.log(error)
      alert(error.statusText)
    }
  
    alertNotice(notice = {type:"undefiend", statusText: "Notice Unknown"}){
      console.log(notice)
      this.alert.innerText = notice.statusText
    }

}

export {AppManager}