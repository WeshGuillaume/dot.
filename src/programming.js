
const { char } = require('./chars')
const { symbol } = require('./strings')

const {
  sequence,
  skip,
  endBy,
  noneOf
} = require('./combinators')

const openBrace = char('{')
const closeBrace = char('}')
const openBracket = char('[')
const closeBracket = char(']')
const comma = char(',')

const createBoolean = (t, f) => oneOf(symbol(t), symbol(f))

const string = state =>
  sequence(skip(char('"')), endBy(char('"'))(noneOf('"')))(state)[0].join('')
