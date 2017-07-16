
const { noneOf, digit, char, letter } = require('./chars')
const { between, oneOf, many1, sequence, endBy, skip, sepBy } = require('./combinators')
const { symbol } = require('./strings')
const { createState } = require('./state')

const string = state =>
  sequence(skip(char('"')), endBy(char('"'))(noneOf('"')))(state)[0].join('')

const openBrace = char('{')
const closeBrace = char('}')
const openBracket = char('[')
const closeBracket = char(']')
const comma = char(',')

const key = string

const number = state => parseInt(many1(digit)(state).join(''))

const T = symbol('true')
const F = symbol('false')
const boolean = oneOf(T, F)

function value (state) {
  return oneOf(number, string, array, object)(state)
}

function array (state) {
  return between(openBracket, closeBracket)(sepBy(comma)(value))(state)
}

const pair = state => {
  return sequence(key, skip(char(':')), value)(state)
}

function propsList (state) {
  return sepBy(comma)(pair)(state)
}

function object (state) {
  return between(char('{'), char('}'))(propsList)(state)
}

const state = createState('{"name":["hello",{"hello":"world"}],"age":23}')
const parser = object
console.log(parser(state), state())
