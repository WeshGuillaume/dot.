
import { expect } from 'chai'

import { symbol, noneOf } from '../src/strings'
import { createState } from '../src/state'

describe('Strings', () => {

  it('should parse with noneOf "abc" ', () => {
    const state = createState('hey arnold')
    const parser = noneOf('abc')
    const result = parser(state)
    expect(result).to.equal('hey ')
    expect(state('input')).to.equal('arnold')
  })

  it('should parse a single string symbol', () => {
    const state = createState('hello world')
    const parser = symbol('hello')
    const result = parser(state)
    expect(result).to.equal('hello')
    expect(state('input')).to.equal(' world')
  })

})
