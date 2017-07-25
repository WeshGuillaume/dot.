
import { ParseError } from './errors'
import { parser } from './parser'

/**
 * Characters
 * ----------------------------------------------------------------------------
 */

export function satisfy (fun) {
  return parser(
    `satisfy([javascript])`,
    state => {
      if (!state) { process.exit(0) }
      const ch = state.value.input.charAt(0)
      if (!ch) { return state.error(new ParseError('Unexepected end of input')) }
      if (!fun(ch)) {
        return state.error(new ParseError(`Unexpected token '${ch}'`, state))
      }
      state.consumeChar(ch)
      return state.return(() => ch)
    }
  )
}

const char = c => parser(`char('${c}')`, satisfy(v => v === c, `'${c}'`))
const digit = parser('digit', satisfy(v => v.match(/\d/)))
const letter = parser('letter', satisfy(v => v.match(/[a-zA-Z]/)))
const alphaNum = parser('alphaNum', satisfy(v => v.match(/[a-zA-Z0-9]/)))
const operator = parser('operator', satisfy(v => '+/-*%'.indexOf(v) > -1))
const space = parser('space', satisfy(v => ' \t\n\r'.indexOf(v) > -1))
const noneOf = s => parser(`noneOf('${s}')`, satisfy(v => s.indexOf(v) === -1))

export {
  space,
  char,
  letter,
  digit,
  alphaNum,
  operator,
  noneOf,
}
