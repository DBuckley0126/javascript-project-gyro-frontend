const DesktopAdapter = (function(){

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
        instance = this 
        return instance
      }
    }
  }
})()