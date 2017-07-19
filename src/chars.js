
import { ParseError, raise } from './errors'
import { oneOf, many1 } from './combinators'
import { getFisrtChar, consume } from './utils'
import { number } from './numbers'

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
      raise(new ParseError(`Unexpected '${ch}', expected '${c}'`, state), true)
    }
    consume(state)
    return ch
  }
}

function digit (state) {
  const ch = getFisrtChar(state)
  if (!ch.match(/\d/)) {
    raise(new ParseError(`Unexpected '${ch}', expected a digit`, state), true)
  }
  consume(state)
  return ch
}

function operator (state) {
  const ch = getFisrtChar(state)
  if (['+', '-', '/', '.', '%'].includes(ch)) {
    raise(new ParseError(`Unexpected '${ch}', expected an operator`, state), true)
  }
  consume(state)
  return ch
}

function letter (state) {
  const ch = getFisrtChar(state)
  if (!ch.match(/[a-zA-Z]/)) {
    raise(new ParseError(`Unexpected '${ch}', expected a letter`, state), true)
  }
  consume(state)
  return ch
}

function noneOf (chs) {
  return state => {
    const ch = getFisrtChar(state)
    if (chs.split('').includes(ch)) {
      raise(new ParseError(`Unexpected '${ch}'`, state), true)
    }
    consume(state)
    return ch
  }
}

const alphaNum = oneOf(digit, letter)

const space = oneOf(char(' '), char('\t'), char('\n'))

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
