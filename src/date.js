
import { parser } from './parser'
import { lexeme, symbol } from './strings'

import {
  char,
} from './chars'

import {
  sequence,
  maybe,
  oneOf,
} from './combinators'

import { number } from './numbers'

const patterns = {
  hour: [
    'hour',
    'h',
  ],
  minute: [
    'minute',
    'm',
  ],
  second: [
    'second',
    's',
  ]
}

const separator = parser(
  'separator',
  maybe(lexeme(oneOf(
    char(':'),
    symbol('and'),
  )))
)

function factory (name) {
  return parser(
    name,
    sequence(
      lexeme(number),
      maybe(lexeme(sequence(
        oneOf(...patterns[name].map(symbol)),
        maybe(char('s'))
      ))),
    ),
    v => ({ [name]: v[0] })
  )
}

const hour = factory('hour')
const minute = factory('minute')
const second = factory('second')

const date = parser(
  'date',
  sequence(
    maybe(sequence(hour, separator)),
    maybe(sequence(minute, separator)),
    maybe(sequence(second, separator))
  )
)

export {
  date,
}
