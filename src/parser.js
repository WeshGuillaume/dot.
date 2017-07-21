
function parser (
  name,
  p,
  success = v => v,
  setError = true
) {
  const handler = state => {
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

      return result.return(old => success(old, result.value.return))

    } catch (e) {
      console.log(name, e)
      process.exit(0)
      throw new Error(`[Uncaught error: ${name}]: ${e.message}`)
    }
  }
  handler.parserName = name
  return handler
}

export { parser }
