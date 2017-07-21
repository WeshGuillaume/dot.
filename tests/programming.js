
import { expect } from 'chai'

import { createState } from '../src/state'

import {
  string,
} from '../src/programming'

function testSuccess (parser, input, expected) {
  it(`Success: ${parser.parserName}`, () => {
    const state = createState({ input })
    const result = parser(state)
    expect(result.value.return).to.equal(expected)
    expect(result.value.error).to.equal(null)
  })
}

describe('Programming', () => {

  testSuccess(string, '"hello"', 'hello')

})
