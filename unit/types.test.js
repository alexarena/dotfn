const TYPES = require('../src/types')

describe('TYPES.INT', () => {
  it('returns an int when passed an int', ()=>{
    expect(TYPES.INT(4)).toBe(4)
  })

  it('returns an int when passed a negative int', ()=>{
    expect(TYPES.INT(-1)).toBe(-1)
  })

  it('returns 0 when passed 0', ()=>{
    expect(TYPES.INT(0)).toBe(0)
  })

  it('casts compatible strings to ints', ()=>{
    expect(TYPES.INT("4")).toBe(4)
  })

  it('throws a TypeError when cast from string is not possible ', ()=>{
    const e = new TypeError(`Alex is not an int.`)
    expect(()=>{
      TYPES.INT("Alex")
    }).toThrow(e)
  })

  it('throws a TypeError when null is passed', ()=>{
    const e = new TypeError(`null is not an int.`)
    expect(()=>{
      TYPES.INT(null)
    }).toThrow(e)
  })

  it('throws a TypeError when undefined is passed', ()=>{
    const e = new TypeError(`undefined is not an int.`)
    expect(()=>{
      TYPES.INT(undefined)
    }).toThrow(e)
  })

  it('throws a TypeError when a double is passed', ()=>{
    const e = new TypeError(`8.8 is not an int.`)
    expect(()=>{
      TYPES.INT(8.8)
    }).toThrow(e)
  })

  it('throws a TypeError when an object is passed', ()=>{
    const e = new TypeError(`[object Object] is not an int.`)
    expect(()=>{
      TYPES.INT({})
    }).toThrow(e)
  })

  it('throws a TypeError when a function is passed', ()=>{
    const e = new TypeError(`() => {} is not an int.`)
    expect(()=>{
      TYPES.INT(()=>{})
    }).toThrow(e)
  })

})
