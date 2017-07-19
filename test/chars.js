
import { expect } from 'chai'

import { char, noneOf } from '../src/chars'
import { createState } from '../src/state'

describe('Chars', () => {

  it ('should parse a single given char', () => {
    const state = createState('ab')
    const parser = char('a')
    const result = parser(state)
    expect(result).to.equal('a')
    expect(state('input')).to.equal('b')
  })

  it ('should throw an exception', () => {
    const state = createState('ab')
    const parser = char('c')
    const result = () => parser(state)
    expect(result).to.throw(Error)
    expect(state('input')).to.equal('ab')
  })

  it ('should parse noneOf "abc"', () => {
    const state = createState('df')
    const parser = noneOf("abc")
    const result = parser(state)
    expect(result).to.equal('d')
    expect(state('input')).to.equal('f')
  })
})
