
import { ParseError } from './errors'

/**
 * Chars utils
 * ----------------------------------------------------------------------------
 */

function consume (state) {
  let input = state('input')
  let column = state('column')
  let line = state('line')

  if (input.charAt(0) === '\n') {
    column = 0
    line++
  } else {
    column++
  }

  input = input.slice(1)

  state('input', input)
  state('column', column)
  state('line', line)
}

function getFisrtChar (state) {
  const input = state('input')
  if (!input.length) { throw new ParseError('Unexpected end of input', state) }
  return input.charAt(0)
}


export {
  getFisrtChar,
  consume,
}
