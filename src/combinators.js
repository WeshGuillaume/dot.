
const { NO_MATCH, ParseError } = require('./errors')

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
    state.save()
    try {
      const ret = p(state)
      return ret
    } catch (e) {
      state.reset()
      return NO_MATCH
    }
  }
}

/**
 * sequence
 *
 * consume a sequence of parsers in order, return a array of match
 * it also make sure to remove the NO_MATCH due to maybe parsers
 */
function sequence (...ps) {
  return state => {
    return ps.map(p => p(state)).filter(e => e !== NO_MATCH)
  }
}

/**
 * oneOf
 *
 * takes a list of parser, apply them in order and return the first match
 */
function oneOf (...ps) {
  return state => {
    const list = ps.map(maybe)
    for (p of list) {
      const ret = p(state)
      if (ret !== NO_MATCH) { return ret }
    }
    const input = state('input')
    throw new ParseError(`Unexpected ${input.charAt(0)}`, state)
  }
}

/**
 * many
 *
 * parse zero or more occurence of the parser
 */
function many (p) {
  return state => {
    const acc = []
    while (true) {
      try {
        acc.push(p(state))
      } catch (e) {
        return acc
      }
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
    const first = p(state)
    const rest = many(p)(state)
    return [first, ...rest]
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
  return p => state => {
    let _
    state.save()
    try {
      _ = p1(state)
      const ret = p(state)
      _ = p2(state)
      return ret
    } catch (e) {
      state.reset()
      throw e
    }
  }
}

/**
 * sepBy1
 *
 * return an array of one or more occurence of p separated by sep
 */
function sepBy1 (sep) {
  return p => state => {
    const tmp = sequence(p, many(sequence(sep, p)))
    const ret = tmp(state)
    return [ret[0], ...ret[1].map(([_, e]) => e)]
  }
}

/**
 * sepBy1
 *
 * return an array of one or more occurence of p separated by sep
 */
function sepBy (sep) {
  return p => state => {
    const ret = maybe(sepBy1(sep)(p))(state)
    if (ret === NO_MATCH) { return [] }
    return ret
  }
}

/**
 * endByFactory : not exported
 *
 * allows us to generate endBy and endBy1
 */
function endByF (manyF) {
  return end => p => state => {
    state.save()
    try {
      const ret = manyF(p)(state)
      const _ = end(state)
      return ret
    } catch (e) {
      state.reset()
      throw e
    }
  }
}

/**
 * endBy:
 *
 * parse zero or more occurence of a parser ended by another parser
 */
const endBy = endByF(many)

/**
 * endBy1:
 *
 * parse one or more occurence of a parser ended by another parser
 */
const endBy1 = endByF(many1)

function skip (p) {
  return state => {
    const ret = p(state)
    return NO_MATCH
  }
}

function skipMany (p) {
  return skip(many(p))
}

module.exports = {
  maybe,
  endBy1,
  endBy,
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
