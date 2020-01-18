import DesktopAdapter from '../modules'

class DesktopPageManager{

  constructor(container){
    this.desktopContainer = container.querySelector("#")
    this.renderIndex()
  }

  async renderIndex(){
    await this.initBindingsAndEventListeners()
    await this.renderHTML()
  }

  initBindingsAndEventListeners(){
    let createButton = document.querySelector("#create-button")
    let joinButton = document.querySelector("#join-button")
    let desktopDiv = document.querySelector("#desktop-div")
    let mobileDiv = document.querySelector("#mobile-div")
    let alert = document.querySelector("#alert")
    let codeInput = document.querySelector("#code-input")
    let joinCodeAlert = document.querySelector("#join-code")
    let coordinatesDisplay = document.querySelector("#coordinates-display")
  }

  renderHTML(){

  }





}