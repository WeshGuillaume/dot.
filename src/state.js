
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

    type: 'state',

    lineUp: () => {
      state.line++
      state.column = 1
    },

    columnUp: () => {
      state.column++
    },

    error: error => {
      if (error.type === 'ParseError') {
        return createState(Object.assign({}, state, { return: null, error }))
      }
      if (error.type === 'state') {
        return createState(Object.assign({}, state, { return: null, error: error.value.error }))
      }
      throw error
    },

    return: fun => {
      return createState(
        Object.assign(
          {},
          state,
          {
            return: state.error
              ? state.return
              : fun(state.return),
          }
        )
      )
    },

    consumeChar: (ch) => {
      state.input = state.input.slice(1)
      if (ch === '\n') {
        state.line++
        state.column = 1
      } else {
        state.column++
      }
    },

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
