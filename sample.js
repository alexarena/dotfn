const DotFn = require('./src')

const Calculator = {
  add:function(a,b){
    const sum = a+b
    return {result: sum}
  },
  divide: function(a,b){
    if(b === 0){
      throw new Error("DIV_BY_ZERO")
    }
    else if(a === 0){
      throw new Error("NUMERATOR_ZERO")
    }

    const res = a/b
    return {result:res}
  },

  multiply: function(a,b){
    if(a === b){
      throw new Error("USE_SQUARE_INSTEAD")
    }

    const res = a*b
    return {result:res}
  }
}


const app = new DotFn.Server(3000)

const concat = new DotFn.Route('/concat/:a/with/:b',Calculator.add)

const add = new DotFn.Route('/add/:first<int>/to/:second<int>',Calculator.add)
  .onSuccess((sum) => [200,sum])

const multiply = new DotFn.Route('/multiply/:a<int>/by/:b<int>',Calculator.multiply)
  .onSuccess((res) => [200,res])
  .onError((e)=> [400,e.message])

const divide = new DotFn.Route('/divide/:a<int>/by/:b<int>',Calculator.divide)
  .onSuccess((res)=> [200,res])
  .onError((e)=>{
    return({
      'DIV_BY_ZERO':[400,"You can't divide by zero."],
      "NUMERATOR_ZERO":[400,"If the numerator is zero, the answer is zero."]
    })
  })


function specialFunc(req,res){
  res.writeHead(200, {'Content-Type': 'text/plain'})
  res.write(`
    If you need to handle a situation DotFn isn't designed for,
    you can bypass the entire framework and manipulate Node's req/res objects.
  `)
  res.end()
}
const special = new DotFn.Route('/special',specialFunc,{bypass:true})

app.addRoute(add)
app.addRoute(concat)
app.addRoute(multiply)
app.addRoute(divide)
app.addRoute(special)
