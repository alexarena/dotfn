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
  it('returns the same status object if a status object is passed',()=>{
    const obj = [200,'Some error']
    const res = so.fromErrorHandler(obj) //dont need e

    expect(res).toEqual(obj)
  })

  it('returns a status object if a map of messages is passed',()=>{
    const e = new Error("match_me")
    const obj = {
        not_match: {not_a:'status object'},
        match_me: [200,'Matched!']
    }
    const res = so.fromErrorHandler(obj,e)

    expect(res).toEqual([200,'Matched!'])
  })

  it('returns null if map does not have a status obj at that index',()=>{
    const e = new Error("not_match")
    const obj = {
        not_match: {not_a:'status object'},
        match_me: [200,'Matched!']
    }
    const res = so.fromErrorHandler(obj,e)

    expect(res).toEqual(null)
  })

  it('returns null if theres a map and no e',()=>{
    const obj = {
        not_match: {not_a:'status object'},
        match_me: [200,'Matched!']
    }
    const res = so.fromErrorHandler(obj)

    expect(res).toEqual(null)
  })

  it('returns null if theres a map and no e.message',()=>{
    const e = {}
    const obj = {
        not_match: {not_a:'status object'},
        match_me: [200,'Matched!']
    }
    const res = so.fromErrorHandler(obj,e)

    expect(res).toEqual(null)
  })

  it('returns null obj is not an obj',()=>{
    const e = new Error("an_error")
    const obj = null
    const res = so.fromErrorHandler(obj,e)

    expect(res).toEqual(null)
  })

})
