
function parser (
  p,
  success = v => v,
  error = v => v,
) {
  return state => {
    if (state.value.error) {
      return state
    }
    const result = p(state.clone())
    if (result.value.error) {
      return state.error(error(result))
    }
    return result.return(success(result.value.return))
  }
}

export { parser }
