
import { NO_MATCH, ParseError } from './errors'
import { parser } from './parser'

/**
 * Combinators
 * ----------------------------------------------------------------------------
 */

/**
 * maybe
 *
 * takes a parser, try to consume the input. If it succeed, go ahead, otherwise,
 * rollback
 */
function maybe (p) {
  return parser(
    `maybe(${p.parserName})`,
    state => {
      const ret = p(state)
      return ret.value.error
        ? state.return(() => NO_MATCH)
        : ret
    }
  )
}

function sequenceOne (state, parser) {
  if (!!state.value.error) { return state }
  const ret = parser(state.clone())
  if (!!ret.value.error) { return ret }
  return state.setState({
    return: [
      ...state.value.return,
      ...(ret.value.return === NO_MATCH ? [] : [ret.value.return]),
    ],
    input: ret.value.input,
  })
}

/**
 * sequence
 *
 * consume a sequence of parsers in order, return a array of match
 * it also make sure to remove the NO_MATCH due to maybe parsers
 */
function sequence (...ps) {
  return parser(
    `a sequence of [${ps.map(({ parserName }) => parserName).join(', ')}]`,
    state => {
      return ps.reduce(
        (s, p) => p(s).return(v => [...s.value.return, v]),
        state.return(() => [])
      )
    },
    v => v.filter(e => e !== NO_MATCH),
    false
  )
}

/**
 * oneOf
 *
 * takes a list of parser, apply them in order and return the first match
 */
function oneOf (...ps) {
  return parser(
    `oneOf ${ps.map(p => p.parserName).join(', ')}`,
    state => {
      for (const p of ps.map(maybe)) {
        const s = p(state)
        if (s.value.return !== NO_MATCH) {
          return s
        }
      }
      return state.error(
        new ParseError(`Unexpected token: ${state.value.input.charAt(0)}, expected oneOf ${ps.map(p => p.parserName).join(', ')}`, state)
      )
    }
  )
}

/**
 * many
 *
 * parse zero or more occurence of the parser
 */
function many (p) {
  return parser(
    `one or more ${p.parserName}`,
    state => {
      let ret = state.setState({ return: [] })
      while (true) {
        const out = p(ret)
        if (out.value.error) {
          return ret
        }
        ret = out.return(value => [
          ...ret.value.return,
          value,
        ])
      }
    }
  )
}

/**
 * many1
 *
 * parses one or more occurence of p using many
 */
function many1 (p) {
  return parser(
    `one or more ${p.parserName}`,
    state => {
      const firstState = p(state)
      return many(p)(firstState)
        .return(v => [
          firstState.value.return,
          ...v,
        ])
    }
  )
}

/**
 * between
 *
 * takes two delimiters and a parser,
 * return the parser match surrounded by the delimiters
 *
 * usage: between(char('('), char(')'))(symbol('Hello'))
 */
function between (p1, p2) {
  return p => parser(
    `${p.parserName} between ${p1.parserName} and ${p2.parserName}`,
    state => {
      return sequence(skip(p1), p, skip(p2))(state)
    },
    v => v[0]
  )
}

/**
 * sepBy
 *
 * return an array of zero or more occurence of p separated by sep
 */
function sepBy (sep) {
  return p => parser(
    `${p.parserName} separated by ${sep.parserName}`,
    state => {
      const s = sepBy1(sep)(p)(state)
      return s.value.error ? state.return(() => []) : s
    }
  )
}

function sepBy1 (sep) {
  return p => parser(
    `${p.parserName} separated by ${sep.parserName}`,
    state => {
      const s = p(state)
      return many(sequence(skip(sep), p))(s).return(v => ([
        s.value.return, ...v.map(e => e[0])
      ]))
    }
  )
}

function skip (p) {
  return parser(
    `skip ${p.parserName}`,
    p,
    () => NO_MATCH
  )
}

function skipMany (p) {
  return parser(
    `skip many ${p.parserName}`,
    state => skip(many(p))(state)
  )
}

export {
  maybe,
  many1,
  many,
  sepBy,
  sepBy1,
  between,
  sequence,
  oneOf,
  skip,
  skipMany,
}
