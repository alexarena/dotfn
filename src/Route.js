const TYPES = require('./types')

class Route{
  constructor(path,fn,options){

    if(options){
      this.options = options
    }
    else{
      this.options = {}
    }

    path = this._parsePath(path)
    this.path = path
    this.fn = fn
  }

  _getType(part){
    let typeStr = ''
    for(let i=part.length-2; i>0; i--){
      if(part[i] === '<'){
        break
      }
      typeStr = part[i] + typeStr
    }

    typeStr = typeStr.toUpperCase()

    if(TYPES[typeStr]){
      return TYPES[typeStr]
    }

    throw new Error('No such type: ' + typeStr)
  }

  _parsePath(path){
    path = path.split('/')
    if(path[0] === ''){
      path.splice(0, 1)
    }

    let i=0
    for(const part of path){
      if(part[0] === ':' && part[part.length-1] === '>'){
        path[i] = this._getType(part)
      }
      else if(part[0] === ':'){
        path[i] = true
      }
      i++
    }
    return path
  }

  onSuccess(fn){
    this._onSuccess = fn
    return this
  }

  onError(fn){
    this._onError = fn
    return this
  }

}

module.exports = Route
