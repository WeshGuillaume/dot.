
import { char, noneOf } from './chars'

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

function string (state) {
  const s = state.clone()
  const ret = between(
    char('"'),
    char('"')
  )(many(noneOf('"')))(s)
  if (ret.value.error) {
    return state.error(ret.value.error)
  }
  return ret.return(ret.value.return.join(''))
}

export {
  openBracket, closeBracket,
  openBrace, closeBrace,
  comma, semi,
  string,
}
