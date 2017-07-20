
function parser (parser, success = v => v) {
  return state => {
    if (state.value.error) { return state }
    const p = parser(state.clone())
    if (p.value.error) {
      return state.error(p)
    }
    return p.return(success(p.value.return))
  }
}

export { parser }
