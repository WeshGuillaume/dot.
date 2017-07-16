
const { noneOf, digit, char, letter } = require('./chars')
const { many, maybe, between, oneOf, many1, sequence, endBy, skip, sepBy } = require('./combinators')
const { symbol } = require('./strings')
const { createState } = require('./state')

const string = state =>
  sequence(skip(char('"')), endBy(char('"'))(noneOf('"')))(state)[0].join('')

const space = oneOf(char(' '), char('\t'), char('\n'))

const openBrace = char('{')
const closeBrace = char('}')
const openBracket = char('[')
const closeBracket = char(']')
const comma = char(',')

const number = state => parseInt(many1(digit)(state).join(''))

const lexeme = p => state => {
  const ret = sequence(skip(maybe(many(space))), p, skip(maybe(many(space))))(state)
  return ret[0]
}

const key = lexeme(string)

const T = symbol('true')
const F = symbol('false')
const boolean = oneOf(T, F)

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
