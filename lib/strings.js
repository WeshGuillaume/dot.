'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.symbol = exports.lexeme = undefined;

var _combinators = require('./combinators');

var _parser = require('./parser');

var _chars = require('./chars');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Strings
 * ----------------------------------------------------------------------------
 */

/**
 * symbol
 *
 * parse a string using a sequence of char parsers
 */
function symbol(str) {
  return (0, _parser.parser)('symbol(\'' + str + '\')', function (state) {
    // TODO without char
    return _combinators.sequence.apply(undefined, _toConsumableArray(str.split('').map(_chars.char)))(state).return(function (v) {
      return v.join('');
    });
  });
}

function lexeme(p) {
  return (0, _parser.parser)('lexeme(\'' + p.parserName + '\')', function (state) {
    return (0, _combinators.sequence)((0, _combinators.skipMany)(_chars.space), p, (0, _combinators.skipMany)(_chars.space))(state).return(function (v) {
      return v[0];
    });
  });
}

exports.lexeme = lexeme;
exports.symbol = symbol;