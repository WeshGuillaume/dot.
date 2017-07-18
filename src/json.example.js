
import { space, noneOf, digit, char, letter } from './chars'
import { number } from './numbers'
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
  return lexeme(oneOf(boolean, string, array, object, number))(state)
}

function array (state) {
  const delimiter = between(openBracket, closeBracket)
  const values = sepBy(comma)(value)
  return delimiter(values)(state)
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

const state = createState(`{1 2 3  23.213   "hello"  1 0 "fewf"}`)
const parser = between(openBrace, closeBrace)(many(lexeme(oneOf(number, string))))
const ret = parser(state)
console.log(ret)
console.log(state())
