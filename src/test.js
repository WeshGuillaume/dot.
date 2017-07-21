
import { NO_MATCH, ParseError } from './errors'
import { createState } from './state'

import {
  sequence,
  skipMany,
  maybe,
  oneOf,
} from './combinators'

import {
  char,
} from './chars'

const s1 = sequence(
  char('h'),
  maybe(char('e')),
  skipMany(char('l')),
  oneOf(char('w'), char('o'))
)(createState({ input: 'hello' }))
  .return(v => v.join(''))

const s2 = oneOf(char('f'), char('o'))(createState({ input: 'ow' }))

console.log(s1.value)
