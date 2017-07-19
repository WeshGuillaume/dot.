
const DEBUG = false
const NO_MATCH = Symbol('NO_MATCH')

class ParseError extends Error {
  constructor (message, state) {
    super(`[ParseError]: ${message}: position: ${state('line')}:${state('column')}`)
    this.type = 'ParseError'
  }
}

function raise (e, t = false) {
  if (DEBUG) { console.error(e.message) }
  throw e
  if (e.type !== 'ParseError') {
    process.exit(42)
  }
}

export {
  NO_MATCH,
  ParseError,
  raise,
}
