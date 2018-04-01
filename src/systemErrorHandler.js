const SYS_ERRORS = {
  'NOT_FOUND':[404,'Not found.'],
  'DEFAULT':[500, 'An unknown error occured.']
}

function getMatchingSystemError(e,onUnknown){
  if(!e || !e.message || !SYS_ERRORS[e.message]){
    if(onUnknown) onUnknown(e)
    return SYS_ERRORS['DEFAULT']
  }
  return SYS_ERRORS[e.message]
}

module.exports = getMatchingSystemError
