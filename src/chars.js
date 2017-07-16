
const { ParseError } = require('./errors')
const { oneOf } = require('./combinators')

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

/**
 * Characters
 * ----------------------------------------------------------------------------
 */

/**
 * char
 *
 * parse a single character in the source
 *
 * in case of success:
 *  - adjust the input line and column
 *  - slice the input
 * in case of error:
 *  - throw a ParseError
 */
function char (c) {
  return state => {
    const ch = getFisrtChar(state)
    if (ch !== c) {
      throw new ParseError(`Unexpected '${ch}', expected '${c}'`, state)
    }
    consume(state)
    return ch
  }
}

function digit (state) {
  const ch = getFisrtChar(state)
  if (!ch.match(/\d/)) {
    throw new ParseError(`Unexpected '${ch}', expected a digit`, state)
  }
  consume(state)
  return ch
}

function operator (state) {
  const ch = getFisrtChar(state)
  if (['+', '-', '/', '.', '%'].includes(ch)) {
    throw new ParseError(`Unexpected '${ch}', expected an operator`, state)
  }
  consume(state)
  return ch
}

function letter (state) {
  const ch = getFisrtChar(state)
  if (!ch.match(/[a-zA-Z]/)) {
    throw new ParseError(`Unexpected '${ch}', expected a letter`, state)
  }
  consume(state)
  return ch
}

function noneOf (chs) {
  return state => {
    const ch = getFisrtChar(state)
    if (chs.includes(ch)) {
      throw new ParseError(`Unexpected '${ch}'`, state)
    }
    consume(state)
    return ch
  }
}

const alphaNum = oneOf(digit, letter)

module.exports = {
  char,
  letter,
  digit,
  alphaNum,
  operator,
  noneOf,
}
