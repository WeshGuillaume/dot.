
const NO_MATCH = Symbol('NO_MATCH')

class ParseError extends Error {
  constructor (message, state) {
    super(`[ParseError]: ${message}: position: ${state('line')}:${state('column')}`)
  }
}

export {
  NO_MATCH,
  ParseError,
}
