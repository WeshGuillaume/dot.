
const NO_MATCH = Symbol('NO_MATCH')

class ParseError extends Error {
  constructor (message, state) {
    super(`[ParseError]: ${message}: position: ${state('line')}:${state('column')}`)
  }
}

/**
 * State management
 *
 * a State contains the following:
 *  - the current column parsed
 *  - the current source line
 *  - the input left to parse
 *
 * The store is the actual object containing the values
 * The relevant store is the last one
 *
 * Lookahead is implemented by providing two utilities to the state
 *  function: save and reset. It will create a copy of the current store
 *  and remove that copy if an error occured and the input was consumed
 *
 * Usage:
 *
 * const state = createState('1+2')
 * const input = state('input') // 1+2
 * state.save()
 * state('input', input.slice(1))
 * state() // { input: '+2' }
 * state.reset()
 * state() // { input: '1+2' }
 *
 * TODO: - provide a state.apply function in case of success
 *       - change the accessing methods 
 */
function createState (input) {

  const defaultStore = {
    column: 0,
    line: 1,
    input,
  }

  const stores = [defaultStore]
  const getter = () => stores.slice(-1)[0]

  const manager = (key, value) => {
    if (!key) { return getter() }
    if (value === undefined) { return getter()[key] }
    return (stores[stores.length - 1][key] = value)
  }

  manager.save = () => stores.push(Object.assign({}, getter()))
  manager.reset = () => stores.length > 1 ? stores.pop() : false

  return manager
}

/**
 * Characters
 * ----------------------------------------------------------------------------
 */

/**
 * char
 *
 * parse a single character in the source
 *
 * in case of success:
 *  - adjust the input line and column
 *  - slice the input
 * in case of error:
 *  - throw a ParseError
 */
function char (c) {
  return state => {
    const input = state('input')
    const ch = input.charAt(0)
    if (ch !== c) { throw new ParseError(`Unexpected '${ch}', expected '${c}'`, state) }
    if (ch === '\n') {
      state('line', state('line') + 1)
      state('column', 0)
    } else {
      state('column', state('column') + 1)
    }
    state('input', input.slice(1))
    return ch
  }
}

// TODO optimize by not using char
const alphaNum = oneOf(
  ...'qwertyuiopasdfghjklzxcvbnm1234567890'.split('').map(char)
)


/**
 * Strings
 * ----------------------------------------------------------------------------
 */

/**
 * symbol
 *
 * parse a string using a sequence of char parsers
 */
function symbol (str) {
  return state => {
    return sequence(...str.split('').map(char))(state).join('')
  }
}

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
