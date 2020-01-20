class GameManager{

  constructor(PageManager){
    this.PageManager = PageManager
    this.gameCable = PageManager.gameCable
    console.log("New GameManager instance initiated")
  }
  set sensorData(obj){
    this._axisX = obj["x"]
    this._axisY = obj["y"]
    this._axisZ = obj["z"]
  }

  gameData(...selectedGameDataArray){
    if(selectedGameDataArray.length == 0){return {x: this._axisX, y: this._axisY, z: this._axisZ}}
    let outputObject = {}
    for(const elementKey of selectedGameDataArray){
      Object.assign(outputObject, {elementKey: this[elementKey]})
    }
    return outputObject
  }

  get sensorData(){
    return {x: this._axisX, y: this._axisY, z: this._axisZ}
  }
}

export {GameManager}