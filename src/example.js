
const { number, space, noneOf, digit, char, letter } = require('./chars')
const { many, lexeme, maybe, between, oneOf, many1, sequence, endBy, skip, sepBy } = require('./combinators')
const { symbol } = require('./strings')
const { createState } = require('./state')

const {
  createBoolean,
  openBracket,
  closeBracket,
  openBrace,
  closeBrace,
  comma,
  string,
} = require('./programming')


const key = lexeme(string)

const boolean = createBoolean('true', 'false')

function value (state) {
  return lexeme(oneOf(boolean, string, array, object, number))(state)
}

function array (state) {
  return between(openBracket, closeBracket)(sepBy(comma)(value))(state)
}

const pair = state => {
  const ret = lexeme(sequence(key, skip(char(':')), value))(state)
  return { [ret[0]]: ret[1] }
}

function propsList (state) {
  const ret = sepBy(comma)(pair)(state)
  return Object.assign(...ret)
}

function object (state) {
  return between(char('{'), char('}'))(propsList)(state)
}

const state = createState(`
{
  "name": "guillaume",
  "age": 23,
  "city": {
    "name": "Paris",
    "streets": [
      { "name": "crimée" },
      { "name": "jean-jaures" }
    ]
  }
}
`)

const parser = value
const ret = parser(state)
console.log(ret, state())
