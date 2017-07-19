
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
        return createState(Object.assign({}, state, { return: null, error }))
      }
    },

    return: value => {
      return createState(Object.assign({}, state, { error: null, return: value }))
    },

    consumeChar: () => state.input = state.input.slice(1),

    clone: () => createState(
      Object.assign({}, state, { error: null, return: null })
    ),

    ignoreError: () => (state.error = null),

    setState: update => {
      const s = Object.assign({}, state, update, { error: null })
      return createState(s)
    },

    get value () { return state }
  }
}

export { createState }
