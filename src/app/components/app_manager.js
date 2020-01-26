import {DesktopPageManager, MobilePageManager} from '../modules'

class AppManager{

  constructor(container){
    this.container = container
    this.initBindingsAndEventListeners()
  }

  initBindingsAndEventListeners(){
    // Set AppManagers attributes to HTML elements
    this.alert = this.container.querySelector("#app-alert")
    this.beginButton = this.container.querySelector('#app-begin-button')

    // Initialise listeners
    this.addBeginButtonListener(this.beginButton)

    return Promise.resolve("Finished setting bindings and listeners")
  }

  // Listeners
  addBeginButtonListener(element, context = this){
    this.beginButton.addEventListener('click', function(event){
      console.log("INFO: Begin application")
      async function beginSequence(){
        try{
          context.beginButton.style.display = "none"
          await context.openFullscreen(context.container)
          console.log("INFO: Fullscreen granted")
          
          if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent)){
            context.pageManager = new MobilePageManager(context.container)
            context.deviceType = "mobile"
          } else {
            context.pageManager = new DesktopPageManager(context.container)
            context.deviceType = "desktop"
          }
          if(context.deviceType === "mobile"){
            await screen.orientation.lock("portrait-primary")
            console.log("INFO: Mobile screen orientation locked")
          } 
        }catch(error){
          context.beginButton.style.display = "block"
          context.failureNotice(error)
        }
      }
      beginSequence()
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