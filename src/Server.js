const HTTP = require('http')
const statusObject = require('./statusObject')
const systemErrorHandler = require('./systemErrorHandler')

function pathsMatch(systemPath,userPath){

  if(systemPath.length !== userPath.length){
    return false
  }

  let params = []
  let typeError = false

  for(let i=0; i<systemPath.length; i++){
    if(systemPath[i] === true){
      params.push(userPath[i])
    }else if(typeof systemPath[i] === 'function'){

      const toType = systemPath[i]
      const p = userPath[i]

      try{
        const typedRes = toType(p)
        params.push(typedRes)
      }
      catch(e){
        typeError = e
      }
    }
    else if(systemPath[i] !== userPath[i]){
      return false
    }
  }

  if(typeError){
    throw typeError
  }

  return params
}

class DotFn{
  constructor(port){

    this.routes = []
    this.server = this.server.bind(this)

    HTTP.createServer(this.server).listen(port,()=>{
      console.log('DotFn is listening on ' + port)
    })
  }

  async server(req,res){
    let onErrorFn = null
    try{
      const route = this.getMatchingRoute(req.url)
      if(route._onError){
        onErrorFn = route._onError
      }
      await this.handleRoute(route,req,res)
    }
    catch(e){
      const errObj = await this.getErrorStatusObject(e,onErrorFn)
      res.writeHead(errObj[0], {'Content-Type': 'text/plain'})
      res.write(errObj[1])
    }

    res.end()
  }

  async getErrorStatusObject(e,onError){

    if(e instanceof TypeError){
      return [400,`TypeError: ${e.message}`]
    }

    if(!onError){
      return systemErrorHandler(e)
    }

    const errRes = await onError(e)
    const errStatusObj = statusObject.fromErrorHandler(errRes,e)
    if(errStatusObj){
      return errStatusObj
    }

    return systemErrorHandler(null)
  }

  async handleRoute(route,req,res){

    if(route.options.bypass){
      return route.fn(req,res)
    }

    const returnVal = await route.fn(...route.params)

    let status = 200
    let body = JSON.stringify(returnVal)

    if(route._onSuccess){
      const resArr = await route._onSuccess(returnVal)
      status = resArr[0]
      body = JSON.stringify(resArr[1])
    }

    res.writeHead(status, {'Content-Type': 'application/javascript'})
    res.write(body)
  }

  getMatchingRoute(pathIn){

    pathIn = pathIn.split('/')
    if(pathIn[0] === ''){
      pathIn.splice(0, 1)
    }

    for(const systemRoute of this.routes){
      const params = pathsMatch(systemRoute.path,pathIn)

      if(params){
        systemRoute.params = params
        return systemRoute
      }
    }

    throw new Error("NOT_FOUND")
  }

  addRoute(r){
    //TODO: check if instanceof route
    //TODO: handle duplicate routes
    this.routes.push(r)
    return this
  }
}

module.exports = DotFn
