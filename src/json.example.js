
import { number, space, noneOf, digit, char, letter } from './chars'
import { skipMany, many, lexeme, maybe, between, oneOf, many1, sequence, endBy, skip, sepBy } from './combinators'
import { symbol } from './strings'
import { createState } from './state'


const {
  openBracket,
  closeBracket,
  openBrace,
  closeBrace,
  comma,
  string,
} = require('./programming')


const key = string

const boolean = oneOf(symbol('true'), symbol('false'))

function value (state) {
  return oneOf(boolean, string, array, object, number)(state)
}

function array (state) {
  return between(openBracket, closeBracket)(sepBy(comma)(value))(state)
}

function pair (state) {
  const ret = sequence(key, skip(char(':')), value)(state)
  return { [ret[0]]: ret[1] }
}

function propsList (state) {
  const ret = sepBy(comma)(pair)(state)
  return Object.assign({}, ...ret)
}

function object (state) {
  return between(
    openBrace,
    closeBrace
  )(propsList)(state)
}

const state = createState(`true`)
const parser = lexeme(boolean)
const ret = parser(state)
console.log(ret, state())
