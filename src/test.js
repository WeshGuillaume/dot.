
import { createState } from './state'
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
  const { value } = sequence(...chs.split('').map(char))(state)
  if (value.return.join('') !== output) {
    console.log(`
      expected: ${output}
      got: ${value.return}
    `)
  }
}

testChar(char('a'), 'ab', 'a')
testChar(space, '  ', ' ')
testChar(letter, 'r1', 'r')
testChar(digit, '2', '2')
testChar(alphaNum, 'e', 'e')
testChar(alphaNum, '4', '4')
testChar(operator, '+', '+')
testChar(noneOf('ab'), 'c', 'c')

testMaybe('a', 'ab', 'a')
testMaybe('a', 'eb', null)

testSequence('abc', 'abcd', 'abc')
testSequence('axc', 'abcd', 'axc')
