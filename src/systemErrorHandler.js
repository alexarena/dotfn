const SYS_ERRORS = {
  'NOT_FOUND':[404,'Not found.'],
  'DEFAULT':[500, 'An unknown error occured.']
}

function getMatchingSystemError(e){
  if(!SYS_ERRORS[e.message]){
    console.error('Unhandled error: ', e)
    return SYS_ERRORS['DEFAULT']
  }
  return SYS_ERRORS[e.message]
}

module.exports = getMatchingSystemError
