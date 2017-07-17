
import { ParseError } from './errors'
import { oneOf } from './combinators'
import { getFisrtChar, consume } from './utils'

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

const space = oneOf(char(' '), char('\t'), char('\n'))

const number = state => parseInt(many1(digit)(state).join(''))

export {
  space,
  char,
  letter,
  digit,
  number,
  alphaNum,
  operator,
  noneOf,
}
