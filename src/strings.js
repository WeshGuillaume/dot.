
import { raise } from './errors'
import { sequence, many1, skipMany } from './combinators'
import * as chars from './chars'

/**
 * Strings
 * ----------------------------------------------------------------------------
 */

/**
 * symbol
 *
 * parse a string using a sequence of char parsers
 */
function symbol (str) {
  return state => {
    const ret = sequence(
      ...str.split('').map(chars.char)
    )(state)
    return ret.join('')
  }
}

function noneOf (str) {
  return state => {
    return many1(chars.noneOf(str))(state).join('')
  }
}

function lexeme (p) {
  return state => {
    const ret = sequence(
      skipMany(chars.space),
      p,
      skipMany(chars.space)
    )(state)
    return ret[0]
  }
}

export {
  symbol,
  noneOf,
  lexeme,
}
