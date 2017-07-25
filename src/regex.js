
import { parser } from './parser'
import { createState } from './state'

import { between, sequence, skip, oneOf, many1, many, range, maybe, sepBy1 } from './combinators'
import { alphaNum, char, satisfy } from './chars'
import { lexeme, symbol } from './strings'
import { integer } from './numbers'

const bBraces = between(char('{'), char('}'))
const bBrackets = between(char('['), char(']'))
const bParens = between(char('('), char(')'))

const dash = char('-')
const comma = char(',')
const eol = char('$')
const bol = char('^')
const maybeOperator = char('?')
const or = char('|')
const plusOperator = char('+')
const timesOperator = char('*')

function rangeToParser (ranges) {
  const charParsers = ranges.map(
    ([min, max]) => satisfy(c => c >= min && c <= max)
  )
  return oneOf(...charParsers)
}

function reRange () {
  return parser(
    '.range',
    bBrackets(
      many1(sequence(
        alphaNum,
        skip(dash),
        alphaNum,
      ))
    ),
    rangeToParser
  )
}

function reMaybe () {
  return parser(
    'maybe',
    sequence(
      oneOf(
        reChar(),
        reRange(),
      ),
      maybeOperator,
    ),
    v => maybe(v[0])
  )
}

function reDep (dependencies) {
  return parser(
    'dep',
    state => {
      return bBraces(many(alphaNum))(state)
    },
    v => {
      const name = v.join('')
      if (!dependencies[name]) { throw new Error(`No dependency found for name: ${name}`) }
      return dependencies[name]
    }
  )
}

function reAtom (dependencies) {
  return parser(
    'atom',
    oneOf(
      reDep(dependencies),
      reTimes(dependencies),
      reMany(dependencies),
      reMany1(dependencies),
      reMaybe(dependencies),
      reRange(dependencies),
      reChar(dependencies),
    )
  )
}

function reMany1 () {
  return parser(
    'many',
    sequence(
      oneOf(
        reChar(),
        reRange(),
      ),
      plusOperator,
    ),
    v => many1(v[0])
  )
}

function reMany () {
  return parser(
    'many',
    sequence(
      oneOf(
        reChar(),
        reRange(),
      ),
      timesOperator,
    ),
    v => many(v[0])
  )
}

function reTimes () {
  return parser(
    'times',
    sequence(
      oneOf(
        reChar(),
        reRange(),
      ),
      bBraces(
        sequence(
          integer,
          skip(comma),
          integer
        )
      )
    ),
    v => range(v[1][0], v[1][1])(v[0])
  )
}

function reChar () {
  return parser(
    'symbol',
    oneOf(
      alphaNum,
      ...[':', '/', '.'].map(char)
    ),
    char
  )
}

function reParser (dependencies) {
  return parser(
    'parser',
    lexeme(many(oneOf(reCapture(dependencies), reAtom(dependencies)))),
    v => sequence(...v)
  )
}

function reCapture (dependencies) {
  return parser(
    'capture',
    between(symbol('{{'), symbol('}}'))(
      sequence(
        many(alphaNum),
        skip(char(':')),
        reAtom(dependencies)
      )
    ),
    v => {
      let [ name, value ] = v
      name = name.join('')
      value = (_value => state => {
        const ret = _value(state)
        return ret.store({ [name]: ret.value.return })
      })(value)
      return value
    }
  )
}

function compile (name, source, ret, dependencies) {
  const state = createState({ input: source })
  const result = reParser(dependencies)(state)
  if (result.value.error) {
    throw new Error(result.value.error)
  }
  return parser(
    name,
    result.value.return,
    (v, s) => Object.assign({}, s.value.store, ret(v, s.value.store))
  )
}

const url = `https?://www.{{domain:[a-z0-9]+}}.{{extension:{extension}}}`
const extension = parser(
  'extension',
  oneOf(symbol('fr'), symbol('com'))
)

const parse = compile(
  'url',
  url,
  (_, { domain }) => ({ domain: domain.join('') }),
  { extension }
)

console.log(parse)

const state = createState({ input: 'http://www.google.com' })
console.log(parse(state).value)

