
import { NO_MATCH, ParseError } from './errors'

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
  return state => {
    const stateTmp = p(state.clone())
    if (state.value.error) {
      return state.return(NO_MATCH)
    }
    return stateTmp
  }
}

function sequenceOne (state, parser) {
  if (!!state.value.error) { return null }
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
  return state => {
    const s = ps.reduce(
      sequenceOne,
      state.setState({ return: [] })
    )
    return s
  }
}

/**
 * oneOf
 *
 * takes a list of parser, apply them in order and return the first match
 */
function oneOf (...ps) {
  return state => {
    for (const p of ps) {
      const s = state.clone()
      if (!p(s).value.error) {
        return s
      }
    }
    return state.error(new ParseError(`Unexpected token: ${state.value.input.charAt(0)}`, state))
  }
}

/**
 * many
 *
 * parse zero or more occurence of the parser
 */
function many (p) {
  return state => {
    let ret = state.setState({ return: [] })
    while (true) {
      const out = p(ret.clone())
      if (out.value.error) {
        return ret
      }
      ret = out.return([
        ...ret.value.return,
        out.value.return,
      ])
    }
  }
}

/**
 * many1
 *
 * parses one or more occurence of p using many
 */
function many1 (p) {
  return state => {
    const s = state.clone()
    const firstState = p(s)
    if (firstState.value.error) {
      return state.error(new ParseError(`Unexpected '${state.value.input.charAt(0)}'`, state))
    }
    const others = many(p)(firstState.clone())
    return state.return([
      firstState.value.return,
      ...others.value.return,
    ])
  }
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
  return p => sequence(p1, p, p2)
}

/**
 * sepBy1
 *
 * return an array of one or more occurence of p separated by sep
 */
function sepBy (sep) {
  return p => state => {
    const s = sepBy1(sep)(p)(state.clone())
    if (s.value.error) { return state.return([]) }
    return s
  }
}

function sepBy1 (sep) {
  return p => state => {
    const s = p(state.clone())
    if (s.value.error) { return state.error(s.value.error) }
    const ret = many(sequence(sep, p))(s)
    return state.return([s.value.return, ...ret.value.return])
  }
}

function skip (p) {
  return state => {
    const ret = p(state.clone())
    if (ret.value.error) {
      return state.error(ret.value.error)
    }
    return ret.return(NO_MATCH)
  }
}

function skipMany (p) {
  return state => {
    return skip(many(p))(state.clone())
  }
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
