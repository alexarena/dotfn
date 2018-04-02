function isStatusObject(obj){

  if(!Array.isArray(obj)){
    return false
  }
  if(obj.length !== 2){
    return false
  }
  if(!Number.isInteger(obj[0])){
    return false
  }
  if(typeof(obj[1]) !== 'string'){
    return false
  }
  return true
}

function fromErrorHandler(obj,e){

  if(isStatusObject(obj)){
    return obj
  }

  if(!e || !e.message || !obj){
    return null
  }

  if(typeof(obj) === 'object'){
    const status = obj[e.message]
    if(isStatusObject(status)){
      return status
    }
  }

  return null
}

module.exports = {
  isStatusObject,fromErrorHandler
}
