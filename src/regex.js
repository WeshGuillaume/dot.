
import { parser } from './parser'
import { createState } from './state'

import { between, sequence, skip, oneOf } from './combinators'
import { alphaNum, char } from './chars'

function reRange () {}
function reMany () {}
function reMany1 () {}
function reMatchGroup () {}
function reTimes () {}
function rePosition () {}
function reEscapedChar () {}
function reSymbol () {}
function reReference () {}

const bBraces = between(char('{'), char('}'))
const bBrackets = between(char('['), char(']'))
const bParens = between(char('('), char(')'))

const dash = char('-')
const eol = char('$')
const bol = char('^')
const or = char('|')
const plus = char('+')
const times = char('*')

function reRange () {
  return parser(
    '.range',
    bBrackets(
      sequence(
        alphaNum,
        skip(dash),
        alphaNum,
      )
    )
  )
}

function reMany () {
  return parser(
    'many',
    sequence(
      oneOf(
        reRange(),
      ),
      times,
    )
  )
}

const state = createState({ input: '[a-z]*' })
const result = reMany()(state)
console.log(result.value)
