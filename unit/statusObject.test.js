const so = require('../src/statusObject')

describe('statusObject.isStatusObject(obj)', () => {

  it('returns true when its an array with an int @0 and string @1', ()=>{
    expect(so.isStatusObject([200,"cool"])).toBe(true)
  })

  it('returns false when the obj is not an array', ()=>{
    expect(so.isStatusObject({})).toBe(false)
  })

  it('returns false when !obj', ()=>{
    expect(so.isStatusObject()).toBe(false)
    expect(so.isStatusObject(null)).toBe(false)
    expect(so.isStatusObject(undefined)).toBe(false)
  })

  it('returns false when the array length is not 2', ()=>{
    expect(so.isStatusObject([])).toBe(false)
    expect(so.isStatusObject([1])).toBe(false)
    expect(so.isStatusObject([1,2,3])).toBe(false)
  })

  it('returns false when the second element is not a string', ()=>{
    expect(so.isStatusObject([200,{}])).toBe(false)
  })

  it('returns false when the first element is not an int', ()=>{
    expect(so.isStatusObject([null,"cool"])).toBe(false)
    expect(so.isStatusObject([{},"cool"])).toBe(false)
    expect(so.isStatusObject([undefined,"cool"])).toBe(false)
  })

})

describe('statusObject.fromErrorHandler(obj,e)',()=>{
  
})
