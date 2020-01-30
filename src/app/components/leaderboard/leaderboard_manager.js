import { DesktopPageManager} from '../../modules'

class LeaderboardManager{

  constructor(pageManager, container){
    this.container = container.querySelector("#desktop-leaderboard-container")
    this.pageManager = pageManager
    this.lastResult = null
    this.currentPlayerResultContainer = this.container.querySelector('#current-player-result')
    this.resultsContainer = this.container.querySelector('#results-container')
    this.updateButton = this.container.querySelector('#leaderboard-update-button')
    this.showEntry = this.container.querySelector('#show-entry')
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

  showLeaderboardEntry(entry_id){

    async function send(context) {
 
      let res = await fetch(context.pageManager.appURL + `/leaderboard/${entry_id}`)
      context.pageManager.checkRes(res)
      let json = await res.json()
      let returnedEntry = json.data
      context.displayEntry(returnedEntry)

    }

    send(this)
  }

  displayEntry(returnedEntry){
    this.showEntry.innerText =  `Nickname: ${returnedEntry.attributes.nickname} Highest Score: ${returnedEntry.attributes.highest_score.score}`
    this.showEntry.style.display = "block"
  }

  
  async fetchAndLoadAllData() {
    try{
      const res = await fetch(`${this.pageManager.appURL}leaderboard`)
      this.pageManager.checkRes(res)
      const json = await res.json()
      this.currentData = json.data
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
      html.body.querySelector('div').addEventListener('click', (event)=>{
        this.showLeaderboardEntry(event.target.dataset.id)
      })
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