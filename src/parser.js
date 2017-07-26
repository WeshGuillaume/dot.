
function parser (
  name,
  p,
  success = v => v,
  setError = true
) {
  const handler = state => {
    if (typeof name !== 'string') {
      throw new Error('Parsers names have to be a string')
    }

    if (typeof p !== 'function') {
      throw new Error(`Parser ${name} is invalid`)
    }

    if (!state || !state.value) {
      throw new Error(`Invalid state provided to ${name}, ${JSON.stringify(state, null, 2)}`)
    }

    try {
      if (state.value.error) {
        return state
      }

      const result = p(state.clone())

      if (!result) {
        console.log(name, result)
        process.exit(0)
      }

      if (result.value.error) {
        if (setError) { result.value.error.expected = name }
        return state.error(result.value.error)
      }

      return result.return(old => success(old, result.value))

    } catch (e) {
      console.log(name, e, state.value)
      process.exit(0)
      throw new Error(`[Uncaught error: ${name}]: ${e.message}`)
    }
  }
  handler.parserName = name
  return handler
}

export { parser }
