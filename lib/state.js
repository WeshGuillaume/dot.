'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * State management
 */

var defaultStore = {
  column: 0,
  line: 1,
  input: '',
  return: null,
  error: null,
  store: {}
};

function createState(state) {

  state = Object.assign({}, defaultStore, state);

  return {

    type: 'state',

    lineUp: function lineUp() {
      state.line++;
      state.column = 1;
    },

    columnUp: function columnUp() {
      state.column++;
    },

    error: function error(_error) {
      if (_error.type === 'ParseError') {
        return createState(Object.assign({}, state, { return: null, error: _error }));
      }
      if (_error.type === 'state') {
        return createState(Object.assign({}, state, { return: null, error: _error.value.error }));
      }
      throw _error;
    },

    return: function _return(fun) {
      return createState(Object.assign({}, state, {
        return: state.error ? state.return : fun(state.return)
      }));
    },

    consumeChar: function consumeChar(ch) {
      state.input = state.input.slice(1);
      if (ch === '\n') {
        state.line++;
        state.column = 1;
      } else {
        state.column++;
      }
    },

    clone: function clone() {
      return createState(Object.assign({}, state, { error: null, return: null }));
    },

    ignoreError: function ignoreError() {
      return state.error = null;
    },

    store: function store(update) {
      return createState(Object.assign({}, state, { store: Object.assign({}, state.store, update) }));
    },

    setState: function setState(update) {
      var s = Object.assign({}, state, update, { error: null });
      return createState(s);
    },

    get value() {
      return state;
    }
  };
}

exports.createState = createState;