
import { createState } from './state'

import { symbol, lexeme } from './strings'

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
  maybe,
  sequence,
  skip,
  skipMany,
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

const s = createState({ input: '  abcd  e' })
const parser = lexeme(symbol('abcd'))
const s1 = parser(s)
console.log(s1.value)
