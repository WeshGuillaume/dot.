
import { sequence } from './combinators'
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
    const ret = sequence(...str.split('').map(chars.char))(state).join('')
    return ret
  }
}

function noneOf (str) {
  return state => {
    const acc = []
    while (true) {
      try {
        const ret = chars.noneOf(str)
        acc.push(ret)
      } catch (e) {
        return acc.join('')
      }
    }
  }
}

function lexeme (p) {
  return state => {
    const ret = sequence(
      skipMany(space),
      p,
      skipMany(space)
    )(state)
    return ret[0]
  }
}

export {
  lexeme,
  symbol,
  noneOf,
}
