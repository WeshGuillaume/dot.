
import { sequence, skipMany } from './combinators'
import { parser } from './parser'
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
  return parser(
    `symbol(${str})`,
    state => {
      // TODO without char
      sequence(...str.split('').map(char))(state)
        .return(v => v.join(''))
    }
  )
}

function lexeme (p) {
  return parser(
    `lexeme(${p.parserName})`,
    state => {
      return sequence(skipMany(space), p, skipMany(space))(state)
        .return(v => v[0])
    }
  )
}

export {
  lexeme,
  symbol,
}
