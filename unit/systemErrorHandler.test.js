const systemErrorHandler = require('../src/systemErrorHandler')

const defaultError = [500, 'An unknown error occured.']

describe('systemErrorHandler(e)', () => {

  it('returns the matching error status object',()=>{
    const e = new Error("NOT_FOUND")
    expect(systemErrorHandler(e)).toEqual([404,'Not found.'])
  })

  it('returns the default status object when null is passed', ()=>{
    expect(systemErrorHandler(null)).toEqual(defaultError)
  })

  it('returns the default status object when an unknown error is passed', ()=>{
    const e = new Error("something unknown")
    expect(systemErrorHandler(e)).toEqual(defaultError)
  })

  it('calls the onUnknown function when an error is unknown', ()=>{
    let passedErr = null
    const cb = (err) => {
      passedErr = err
    }

    const expectedErr = new Error("something unknown")
    systemErrorHandler(expectedErr,cb)
    expect(passedErr).toEqual(expectedErr)
  })

})
