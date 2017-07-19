
import { space, noneOf, digit, char, letter } from './chars'
import { number } from './numbers'
import { skipMany, many, maybe, between, oneOf, many1, sequence, endBy, skip, sepBy, sepBy1 } from './combinators'
import { symbol, lexeme } from './strings'
import { createState } from './state'


const {
  openBracket,
  closeBracket,
  openBrace,
  closeBrace,
  comma,
  string,
} = require('./programming')

const surroundedByBraces = between(openBrace, closeBrace)
const surroundedByBracket = between(openBracket, closeBracket)

function value (state) {
  return lexeme(oneOf(jsonObject, jsonArray, jsonString, jsonNumber))(state.clone())
}

function jsonNumber (state) {
  const num = number(state.clone())
  if (num.value.error) {
    return state.error(num.value.error)
  }
  return num.return(parseInt(num.value.return))
}

function jsonString (state) {
  const str = string(state.clone())
  return str
}

function jsonArray (state) {
  const s = surroundedByBracket(
    sepBy1(char(','))(value)
  )(state.clone())
  if (s.value.error) {
    return state.error(s.value.error)
  }
  return s
}

function keyValuePair (state) {
  const ret = sequence(lexeme(string), skip(char(':')), value)(state.clone())
  if (ret.value.error) {
    return state.error(ret.value.error)
  }
  return ret.return({ [ret.value.return[0]]: ret.value.return[1] })
}

function jsonObject (state) {
  const list = sepBy1(lexeme(comma))(keyValuePair)
  const ret = surroundedByBraces(list)(state.clone())
  if (ret.value.error) {
    return state.error(ret.value.error)
  }
  return ret.return(Object.assign({}, ...ret.value.return))
}

const state = createState({
  input: `
    {
      "hello": "world",
      "age": 22,
      "friends": [
        {
          "name": "john", "age": 32
        }
      ]
    }
  `,
})

const parser = value
console.log(JSON.stringify(parser(state).value, null, 2))

/**
{
  "column": 1,
  "line": 1,
  "input": "",
  "return": {
    "hello": "world",
    "age": 22,
    "friends": [
      {
        "name": "john",
        "age": 32
      }
    ]
  },
  "error": null
}
*/
