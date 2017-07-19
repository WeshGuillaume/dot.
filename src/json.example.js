
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
  return oneOf(array, number, string, object, boolean)(state)
}

function array (state) {
  const delimiter = between(openBracket, closeBracket)
  const values = sepBy(comma)(lexeme(value))
  return delimiter(values)(state)
}

function pair (state) {
  const ret = sequence(lexeme(key), skip(char(':')), lexeme(value))(state)
  return { [ret[0]]: ret[1] }
}

function propsList (state) {
  const ret = sepBy(comma)(lexeme(pair))(state)
  return Object.assign({}, ...ret)
}

function object (state) {
  const delimiter = between(openBrace, closeBrace)
  return delimiter(lexeme(propsList))(state)
}

const source = `
{
  "name": "guillaume",
  "age": 22,
  "adult": true,
  "height": 1.88,
  "colleagues": [{ "name": "abed" }, { "name": "edouard" }]
}
`

const json = source => lexeme(value)(createState(source))

console.log(json(source))
