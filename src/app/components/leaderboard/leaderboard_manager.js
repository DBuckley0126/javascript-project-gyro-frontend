import { DesktopPageManager} from '../../modules'

class LeaderboardManager{

  constructor(pageManager, container){
    this.container = container.querySelector("#desktop-leaderboard-container")
    this.pageManager = pageManager
    this.lastResult = null
    this.currentPlayerResultContainer = this.container.querySelector('#current-player-result')
    this.resultsContainer = this.container.querySelector('#results-container')
    this.updateButton = this.container.querySelector('#leaderboard-update-button')
    this.fetchAndLoadAllData()
    this.addUpdateLeaderboardListener(this.updateButton)
    
  }

  addUpdateLeaderboardListener(element){
    element.addEventListener('click', function(){
      this.fetchAndLoadAllData()
      // this.sendScoreLeaderboard("blah", 2013)
    }.bind(this))
  }

  

  hide(){
    this.container.style.display = "none"
  }

  show(){
    this.container.style.display = "block"
  }

  hideCurrentScore(){
    this.currentPlayerResultContainer.innerHTML = ""
    this.currentPlayerResultContainer.style.display = "none"
  }


  updateCurrentScore(result){
    console.log("Updated players current score")
    this.currentPlayerResultContainer.innerHTML = ""
    const html = new DOMParser().parseFromString(this.currentPlayerResultHTMLTemplate(result.id, result.attributes.nickname.nickname, result.attributes.score), "text/html")
    this.currentPlayerResultContainer.appendChild(html.body.querySelector('div'))
    this.fetchAndLoadAllData()
    this.currentPlayerResultContainer.style.display = "block"
  }

  sendScoreLeaderboard(nickname, finalScore){
    let configurationObject = {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nickname: nickname,
        score: finalScore 
      })
    }
    async function send(context) {
 
      let res = await fetch(context.pageManager.appURL + `/leaderboard`, configurationObject)
      context.pageManager.checkRes(res)
      let json = await res.json()
      let returnedCurrentScore = json.data
      context.updateCurrentScore(returnedCurrentScore)

    }

    send(this)
  }

  
  async fetchAndLoadAllData() {
    try{
      const res = await fetch(`${this.pageManager.appURL}leaderboard`)
      this.pageManager.checkRes(res)
      const json = await res.json()
      this.currentData = json.data
      console.log('sucessfully received data for leaderboard')
      this.render()
        
    }catch(error){
      this.pageManager.alertNotice(error)
    }
  }

  render(){
    this.resultsContainer.innerHTML = ""
    const context = this
    for(const result of this.currentData){
      const html = new DOMParser().parseFromString(context.leaderboardEntryHTMLTemplate(result.id, result.attributes.nickname.nickname, result.attributes.score, result.attributes.date), "text/html")
      context.resultsContainer.appendChild(html.body.querySelector('div'))
    }
  }

  currentPlayerResultHTMLTemplate(id, nickname, score){
    return `
      <div data-id="${id}" id="leaderboard-entry-current-result">
        <text>${nickname}</text><text>Score: ${score}</text>
      </div>
    `
  }

  leaderboardEntryHTMLTemplate(id, nickname, score, date){
    return `
      <div data-id="${id}" class="leaderboard-entry">
        <text>${nickname}</text><text>Score: ${score}</text><text>${date}</text>
      </div> 
    `
  }

 
}

export {LeaderboardManager}