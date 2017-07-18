
import { char, noneOf } from './chars'
import { symbol } from './strings'

const {
  sequence,
  skip,
  oneOf,
  endBy,
} = require('./combinators')

const openBrace = char('{')
const closeBrace = char('}')
const openBracket = char('[')
const closeBracket = char(']')
const comma = char(',')
const semi = char(';')

const string = state => {
  return sequence(
    skip(char('"')),
    endBy(char('"'))(noneOf('"'))
  )(state)[0].join('')
}

export {
  openBracket, closeBracket,
  openBrace, closeBrace,
  comma, semi,
  string,
}
