import {AppManager, MobileGameManager, DesktopGameManager} from './modules'
import '../stylesheets/app.css'

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('#app-container')
  window.AppManager = new AppManager(container)

})





