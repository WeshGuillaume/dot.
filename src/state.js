
/**
 * State management
 */

const defaultStore = {
  column: 0,
  line: 1,
  input: '',
  return: null,
  error: null,
}

function createState (state) {

  state = Object.assign({}, defaultStore, state)

  return {

    lineUp: () => {
      state.line++
      state.column = 1
    },

    columnUp: () => {
      state.column++
    },

    error: error => {
      if (error.type !== 'ParseError') {
        throw error
      } else {
        state.error = error
        return createState(Object.assign({}, { return: null }))
      }
    },

    return: value => {
      state.return = value
      return createState(Object.assign({}, state, { error: null }))
    },

    consumeChar: () => state.input = state.input.slice(1),

    clone: () => createState(
      Object.assign({}, state, { error: null, return: null })
    ),

    ignoreError: () => (state.error = null),

    setState: update => {
      const s = Object.assign({}, state, update, { error: null, return: null })
      return createState(s)
    },

    get value () { return state }
  }
}

export { createState }
