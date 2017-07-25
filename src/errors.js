
const NO_MATCH = 'NO_MATCH'

class ParseError extends Error {
  constructor (message, state = { value: {} }) {
    super(`[ParseError]: ${message}: position: ${state.value.line}:${state.value.column + 1}`)
    this.type = 'ParseError'
  }
}

export {
  NO_MATCH,
  ParseError,
}
