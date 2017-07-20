
import { ParseError } from './errors'
import { parser } from './parser'

/**
 * Characters
 * ----------------------------------------------------------------------------
 */

function satisfy (fun) {
  return parser(
    'a character',
    state => {
      const ch = state.value.input.charAt(0)
      if (!fun(ch)) {
        return state.error(new ParseError(`Unexpected token '${ch}', expected: ${expected}`, state))
      }
      state.consumeChar(ch)
      return state.return(() => ch)
    }
  )
}

const char = c => parser(`character ${c}`, satisfy(v => v === c, `'${c}'`))
const digit = parser('a digit', satisfy(v => v.match(/\d/)))
const letter = parser('a letter', satisfy(v => v.match(/[a-zA-Z]/)))
const alphaNum = parser('an alpha-numeric value', satisfy(v => v.match(/[a-zA-Z0-9]/)))
const operator = parser('an operator', satisfy(v => '+/-*%'.indexOf(v) > -1))
const space = parser('a space character', satisfy(v => ' \t\n\r'.indexOf(v) > -1))
const noneOf = s => parser(`none of these: "${s}"`, satisfy(v => s.indexOf(v) === -1))

export {
  space,
  char,
  letter,
  digit,
  alphaNum,
  operator,
  noneOf,
}
