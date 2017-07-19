import {
  skipMany,
  many,
  maybe,
  between,
  oneOf,
  many1,
  sequence,
  endBy,
  skip,
  sepBy,
} from './combinators'

import { ParseError, NO_MATCH } from '../src/errors'
import { char } from './chars'
import { number } from './numbers'
import { symbol, lexeme } from './strings'
import { createState } from './state'

const unitParser = (...synonymous) => state => {
  const syn = oneOf(...synonymous.map(symbol))
  const num = lexeme(number)(state)
  const s = syn(state)
  return { [synonymous[0]]: num }
}

const hour = (...vals) => unitParser('hours', 'hour', 'hs', 'h', 'oclock', "o'clock", ...vals)
const minute = (...vals) => unitParser('minutes', 'minute', "''", 'min', 'm', '', ...vals)
const second = (...vals) => unitParser('seconds', 'second', "'", 'sec', 's', '', ...vals)

const unit = oneOf(minute(), second(), hour())
const sep = lexeme(oneOf(
  char(','),
  char(':'),
  symbol('and'),
  char('')
))

const timeScenarii = oneOf(
  sequence(hour(), minute('')),
  sequence(minute(), second('')),
  sequence(hour(), second()),
  sequence(hour()),
  sequence(minute()),
  sequence(second())
)

const state = createState('3m')
const parser = timeScenarii
const ret = parser(state)
console.log(ret, state())
