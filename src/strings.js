
import { sequence, skipMany } from './combinators'
import { char, space } from './chars'

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
    // TODO without char
    const ret = sequence(...str.split('').map(char))(state.clone())
    if (ret.value.error) {
      return state.error(ret.value.error)
    }
    return ret.return(ret.value.return.join(''))
  }
}

function lexeme (p) {
  return state => {
    const ret = sequence(skipMany(space), p, skipMany(space))(state.clone())
    if (ret.value.error) {
      return state.error(ret.value.error)
    }
    return ret.return(ret.value.return[0])
  }
}

export {
  lexeme,
  symbol,
}
