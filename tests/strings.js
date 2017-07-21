
import { expect } from 'chai'

import { createState } from '../src/state'

import {
  lexeme,
  symbol,
} from '../src/strings'

function testSuccess (parser, input, expected) {
  it(`Success: ${parser.parserName}`, () => {
    const state = createState({ input })
    const result = parser(state)
    expect(result.value.return).to.equal(expected)
    expect(result.value.error).to.equal(null)
  })
}

describe('Strings', () => {

  testSuccess(symbol('hello'), 'hello world', 'hello')
  testSuccess(lexeme(symbol('hello')), '  hello  ', 'hello')
})
