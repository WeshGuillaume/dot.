
import { createState } from '../src/state'
import { expect } from 'chai'
import {
  char,
  digit,
  letter,
  operator,
  noneOf,
  alphaNum,
  space,
} from '../src/chars'

function testSuccess (parser, input, expected) {
  it(`Success: ${parser.parserName}`, () => {
    const state = createState({ input })
    const result = parser(state)
    expect(result.value.return).to.equal(expected)
    expect(result.value.input).to.equal(input.slice(1))
    expect(result.value.error).to.equal(null)
  })
}

function testError (parser, input) {
  it(`Error: ${parser.parserName}`, () => {
    const state = createState({ input })
    const result = parser(state)
    expect(result.value.return).to.equal(null)
    expect(result.value.error).to.not.equal(null)
  })
}

describe('Chars', () => {

  testSuccess(char('a'), 'abcd', 'a')
  testSuccess(digit, '12ed', '1')
  testSuccess(letter, 'as2', 'a')
  testSuccess(operator, '+1', '+')
  testSuccess(alphaNum, '2e', '2')
  testSuccess(space, ' d', ' ')
  testSuccess(noneOf('ab'), 'c', 'c')

  testError(char('a'), 'rbcd')
  testError(digit, 'r2ed')
  testError(letter, '2s2')
  testError(operator, 'r1')
  testError(alphaNum, '+e')
  testError(space, 'rd')
  testError(noneOf('rb'), 'r')

})
