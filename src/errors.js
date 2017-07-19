
const NO_MATCH = Symbol('NO_MATCH')

class ParseError extends Error {
  constructor (message, state) {
    super(`[ParseError]: ${message}: position: ${state.value.line}:${state.value.column + 1}`)
    this.type = 'ParseError'
  }
}

export {
  NO_MATCH,
  ParseError,
}
