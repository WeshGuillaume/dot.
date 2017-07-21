
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
  return lexeme(oneOf(jsonObject, jsonArray, jsonString, jsonNumber))(state)
}

function jsonNumber (state) {
  return number(state).return(parseInt)
}

function jsonString (state) {
  return string(state)
}

function jsonArray (state) {
  return surroundedByBracket(
    sepBy1(char(','))(value)
  )(state)
}

function keyValuePair (state) {
  return sequence(
    lexeme(string),
    skip(char(':')),
    value
  )(state).return(v => ({ [v[0]]: v[1] }))
}

function jsonObject (state) {
  const list = sepBy1(lexeme(comma))(keyValuePair)
  return surroundedByBraces(list)(state)
    .return(list => Object.assign({}, ...list))
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
