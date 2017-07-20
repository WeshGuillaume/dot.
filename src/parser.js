
function parser (
  name,
  p,
  success = v => v,
  setError = true
) {
  const handler = state => {
    if (state.value.error) {
      return state
    }
    const result = p(state.clone())
    if (result.value.error) {
      if (setError) { result.value.error.expected = name }
      return state.error(result.value.error)
    }
    return result.return(old => success(old, result.value.return))
  }
  handler.parserName = name
  return handler
}

export { parser }
