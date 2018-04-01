function toInt(x){
  const xNum = Number(x)

  if(!Number.isInteger(xNum)){
    throw new TypeError(`${x} is not an int.`)
  }
  return xNum
}

const TYPES = {
  'INT':toInt
}

module.exports = TYPES
