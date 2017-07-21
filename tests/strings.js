
import { expect } from 'chai'

import { createState } from '../src/state'

import {
  lexeme,
  symbol,
} from '../src/strings'

describe('Strings', () => {

  // testSuccess(symbol('hello'), 'hello world', 'hello')
  // testSuccess(lexeme(symbol('hello')), '  hello  ', 'hello')

  it(`Success:`, () => {
    const input = 'hello '
    const parser = symbol('hello')
    const output = 'hello'
    const state = createState({ input })
    const result = parser(state)
    expect(result.value.return).to.equal(output)
    expect(result.value.error).to.equal(null)
  })
})
