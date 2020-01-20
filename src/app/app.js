import {AppManager} from './components/app_manager'
import '../stylesheets/app.css'


document.addEventListener('DOMContentLoaded', () => {

  const container = document.querySelector('#app-container')
  window.AppManager = new AppManager(container)

})
