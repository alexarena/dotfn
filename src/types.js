function toInt(x){
  const e = new TypeError(`${x} is not an int.`)
  if(x === null || x === undefined) throw e
  const num = Number(x)

  if(!Number.isInteger(num)){
    throw e
  }
  return num
}

const TYPES = {
  'INT':toInt
}

module.exports = TYPES
