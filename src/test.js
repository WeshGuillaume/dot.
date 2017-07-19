
import { createState } from './state'

import { symbol, lexeme } from './strings'

import {
  string,
} from './programming'

import {
  char,
  space,
  letter,
  alphaNum,
  digit,
  operator,
  noneOf,
} from './chars'

import {
  number,
  float,
  integer,
} from './numbers'

import {
  maybe,
  sequence,
  skip,
  skipMany,
  many1,
  many,
} from './combinators'

function testChar (parser, input, output) {
  const state = createState({ input })
  const ret = parser(state).value.return
  if (ret !== output) {
    console.log(`
      expected: ${output}
      got: ${ret}
    `)
  }
}

function testMaybe(ch, input, output) {
  const state = createState({ input })
  const ret = maybe(char(ch))(state).value.return
  if (ret !== output) {
    console.log(`
      expected: ${output}
      got: ${ret}
    `)
  }
}

function testSequence (chs, input, output) {
  const state = createState({ input })
  const ret = sequence(...chs.split('').map(char))(state)
  if (ret.value.return.join('') !== output) {
    console.log(`
      expected: ${output}
      got: ${ret.value.return}
      error: ${ret.value.error && ret.value.error.message}
    `)
  }
}

// testChar(char('a'), 'ab', 'a')
// testChar(space, '  ', ' ')
// testChar(letter, 'r1', 'r')
// testChar(digit, '2', '2')
// testChar(alphaNum, 'e', 'e')
// testChar(alphaNum, '4', '4')
// testChar(operator, '+', '+')
// testChar(noneOf('ab'), 'c', 'c')

// testMaybe('a', 'ab', 'a')
// testMaybe('a', 'eb', null)

// testSequence('abc', 'abcd', 'abc')

const s = createState({ input: '  . ' })
const parser = sequence(skipMany(space), char('.'), skipMany(space))
const s1 = parser(s)
console.log(s1.value)
