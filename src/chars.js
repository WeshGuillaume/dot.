
import { ParseError } from './errors'

/**
 * Characters
 * ----------------------------------------------------------------------------
 */

function satisfy (check, type) {
  return state => {
    const ch = state.value.input.charAt(0)
    if (check(ch)) {
      state.consumeChar()
      return state.return(ch)
    }
    return (state.error(new ParseError(`Unexpected '${ch}', expected ${type}`, state)))
  }
}

const char = c => satisfy(v => v === c, `'${c}'`)
const digit = satisfy(v => v.match(/\d/), 'a number')
const letter = satisfy(v => v.match(/[a-zA-Z]/), 'a letter')
const alphaNum = satisfy(v => v.match(/[a-zA-Z0-9]/), 'an alpha numeric char')
const operator = satisfy(v => '+/-*%'.indexOf(v) > -1, 'an operator')
const space = satisfy(v => ' \t\n\r'.indexOf(v) > -1, 'a space')
const noneOf = s => satisfy(v => s.indexOf(v) === -1, `none of '${s}'`)

export {
  space,
  char,
  letter,
  digit,
  alphaNum,
  operator,
  noneOf,
}
