const HTTP = require('http')

const SYS_ERRORS = {
  'NOT_FOUND':[404,'Not found.'],
  'DEFAULT':[500, 'An unknown error occured.']
}

function getErrorStatusObject(e){
  if(!SYS_ERRORS[e.message]){
    console.error('Unhandled error: ', e)
    return SYS_ERRORS['DEFAULT']
  }
  return SYS_ERRORS[e.message]
}

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

    let route = null
    try{
      route = this.getMatchingRoute(req.url)
      await this.handleRoute(route,req,res)
    }
    catch(e){
      let errStatusObj = null
      if(route && route._onError){
        const userErrObj = route._onError(e)
        if(isStatusObject(userErrObj)){
          errStatusObj = userErrObj
        }else if(typeof(userErrObj) === 'object'){
          const userErrStatusObj = userErrObj[e.message]
          if(userErrStatusObj && isStatusObject(userErrStatusObj)){
            errStatusObj = userErrStatusObj
          }
        }

      }

      if(e instanceof TypeError){
        errStatusObj = [400,`TypeError: ${e.message}`]
      }

      if(!errStatusObj){
         errStatusObj = getErrorStatusObject(e)
      }

      res.writeHead(errStatusObj[0], {'Content-Type': 'text/plain'})
      res.write(errStatusObj[1])
    }

    res.end()
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
    //TODO: handle duplicate routes
    this.routes.push(r)
    return this
  }
}

module.exports = DotFn
