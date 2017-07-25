
import { expect } from 'chai'

import { NO_MATCH } from '../src/errors'
import { createState } from '../src/state'

import { char } from '../src/chars'

import {
  oneOf,
  maybe,
  sequence,
  many1,
  many,
  skipMany,
  skip,
  range,
  between,
  sepBy1,
  sepBy,
} from '../src/combinators'

function testSuccess (parser, input, output) {
  it(`Success: ${parser.parserName}`, () => {
    const state = createState({ input })
    const result = parser(state)
    expect(result.value.return).to.eql(output)
  })
}

describe('Combinators', () => {

  testSuccess(maybe(char('a')), 'abc', 'a')
  testSuccess(sequence(char('a'), char('b')), 'ab', ['a', 'b'])
  testSuccess(oneOf(char('a'), char('b')), 'ac', 'a')
  testSuccess(many(char('a')), 'hab', [])
  testSuccess(many1(char('a')), 'aab', ['a', 'a'])
  testSuccess(between(char('a'), char('a'))(char('b')), 'aba', 'b')
  testSuccess(sepBy(char(','))(char('a')), '', [])
  testSuccess(sepBy1(char(','))(char('a')), 'a,a', ['a', 'a'])
  testSuccess(skip(char('a')), 'a', NO_MATCH)
  testSuccess(skipMany(char('a')), 'aaaa', NO_MATCH)
  testSuccess(range(2, 3)(char('a')), 'aab', ['a', 'a'])
})
