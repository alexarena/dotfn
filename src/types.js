function toInt(x){
  const num = Number(x)

  if(!Number.isInteger(num)){
    throw new TypeError(`${x} is not an int.`)
  }
  return num
}

const TYPES = {
  'INT':toInt
}

module.exports = TYPES
