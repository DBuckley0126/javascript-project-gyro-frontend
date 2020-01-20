import _ from 'actioncable';

const CableAdapter = (function(){

  //Singleton Holder
  let instance = null 

  return class{
    // Class method to retrieve singleton instance
    static get instance(){
      if(instance === null){ instance = new this() }
      return instance
    }
  
    // Constructor only returns a new instance one time
    constructor(token = null){
      if(instance !== null){ 
        return instance
      }else{
        this.token = token
        if(window.location.hostname == "localhost"){
          this.cable = _.createConsumer(`ws://localhost:3000/cable`)
        } else {
          this.cable = _.createConsumer(`wss://javascript-project-gyro-back.herokuapp.com/cable`)
        }
        instance = this
        return instance
      }
    }

    

  }
})()

export {CableAdapter}