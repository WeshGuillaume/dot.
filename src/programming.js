
import { char, noneOf } from './chars'
import { symbol } from './strings'

const {
  many,
} = require('./combinators')

const openBrace = char('{')
const closeBrace = char('}')
const openBracket = char('[')
const closeBracket = char(']')
const comma = char(',')
const semi = char(';')

function string (state) {
  const s = state.clone()
  const q1 = char('"')(s)
  if (q1.value.error) {
    return state.error(q1.value.error)
  }
  const ret = many(noneOf('"'))(q1)
  if (ret.value.error) {
    return state.error(ret.value.error)
  }
  const q2 = char('"')(ret)
  if (q2.value.error) {
    return state.error(q2.value.error)
  }
  return ret.return(ret.value.return.join(''))
}

export {
  openBracket, closeBracket,
  openBrace, closeBrace,
  comma, semi,
  string,
}
