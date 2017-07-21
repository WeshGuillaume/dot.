
import { char, noneOf } from './chars'
import { parser } from './parser'
import { symbol } from './strings'

const {
  many,
  between,
  sequence,
} = require('./combinators')

const openBrace = char('{')
const closeBrace = char('}')
const openBracket = char('[')
const closeBracket = char(']')
const comma = char(',')
const semi = char(';')

const string = parser(
  'a string',
  state => {
    return between(
      char('"'),
      char('"')
    )(many(noneOf('"')))(state)
      .return(value => value.join(''))
  }
)

export {
  openBracket, closeBracket,
  openBrace, closeBrace,
  comma, semi,
  string,
}
