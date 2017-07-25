
import { parser } from './parser'
import { createState } from './state'

import { alphaNum, letter, char, digit } from './chars'
import { symbol, lexeme } from './strings'
import {
  sequence,
  between,
  oneOf,
  many,
  many1,
  skip,
  sepBy1
} from './combinators'

function parserName (parsers) {
  return parser(
    '.parserRef',
    state =>
      lexeme(sequence(
        skip(char('.')),
        many(letter)
      ))(state),
    v => {
      const name = v[0].join('')
      if (!parsers[name]) {
        throw new Error(`Unknown parser ${name}`)
      }
      return parsers[name]
    }
  )
}

function dotSurrounded (parsers) {
  return parser(
    '.surrounded',
    state =>
      between(char('('), char(')'))(dotParser(parsers))(state)
  )
}

function dotParser (parsers) {
  return parser(
    '.parser',
    state =>
      oneOf(
        dotMaybe(parsers),
        dotMany(parsers),
        dotMany1(parsers),
        dotSequence(parsers),
        dotOneOf(parsers),
        dotSurrounded(parsers),
        parserName(parsers),
        dotSymbol()
      )(state)
  )
}

function dotMaybe (parsers) {
  return parser(
    '.maybe',
    state => sequence(
      oneOf(parserName(parsers), dotSymbol(), dotSurrounded(parsers)),
      skip(char('?'))
    )(state),
    v => maybe(v[0])
  )
}

function dotSequence (parsers) {
  return parser(
    '.sequence',
    state =>
      between(char('('), char(')'))(sepBy1(lexeme(symbol('>>')))(dotParser(parsers)))(state),
    v => sequence(...v)
  )
}

function dotOneOf (parsers) {
  return parser(
    '.oneOf',
    state => 
      between(char('('), char(')'))(sepBy1(lexeme(symbol('|')))(dotParser(parsers)))(state),
    v => oneOf(...v)
  )
}

function dotMany1 (parsers) {
  return parser(
    '.many',
    state => sequence(
      oneOf(parserName(parsers), dotSymbol(), dotSurrounded(parsers)),
      skip(char('+'))
    )(state),
    v => many1(v[0])
  )
}

function dotMany (parsers) {
  return parser(
    '.many',
    state => sequence(
      oneOf(parserName(parsers), dotSymbol(), dotSurrounded(parsers)),
      char('*')
    )(state),
    v => many(v)
  )
}

function dotSymbol (parsers) {
  return parser(
    '.symbol',
    state => many(alphaNum)(state),
    v => symbol(v.join(''))
  )
}

function createParser () {

  const parsers = {}

  return function $ (name, definition) {
    if (typeof name === 'string' && typeof definition === 'string') {
      const state = createState({ input: definition })
      const result = dotParser(parsers)(state)
      parsers[name] = result.value.return
      return result.value
    }

    if (typeof definition === 'function' && definition.parserName) {
      parsers[name] = definition
    }

    if (typeof name !== 'string') {
      throw new Error('Expected name at least')
    }

    return function parse (input) {
      const state = createState({ input })
      const result = parsers[name](state)
      return result
    }
  }
}

const $ = createParser()

$('digit', digit)
$('letter', letter)
$('alphaNum', '(digit | letter)')
$('hex-like', '(0x >> .alphaNum+)')
console.log(test)
