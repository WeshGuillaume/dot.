'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.noneOf = exports.operator = exports.alphaNum = exports.digit = exports.letter = exports.char = exports.space = undefined;
exports.satisfy = satisfy;

var _errors = require('./errors');

var _parser = require('./parser');

/**
 * Characters
 * ----------------------------------------------------------------------------
 */

function satisfy(fun) {
  return (0, _parser.parser)('satisfy([javascript])', function (state) {
    if (!state) {
      process.exit(0);
    }
    var ch = state.value.input.charAt(0);
    if (!ch) {
      return state.error(new _errors.ParseError('Unexepected end of input'));
    }
    if (!fun(ch)) {
      return state.error(new _errors.ParseError('Unexpected token \'' + ch + '\'', state));
    }
    state.consumeChar(ch);
    return state.return(function () {
      return ch;
    });
  });
}

var char = function char(c) {
  return (0, _parser.parser)('char(\'' + c + '\')', satisfy(function (v) {
    return v === c;
  }, '\'' + c + '\''));
};
var digit = (0, _parser.parser)('digit', satisfy(function (v) {
  return v.match(/\d/);
}));
var letter = (0, _parser.parser)('letter', satisfy(function (v) {
  return v.match(/[a-zA-Z]/);
}));
var alphaNum = (0, _parser.parser)('alphaNum', satisfy(function (v) {
  return v.match(/[a-zA-Z0-9]/);
}));
var operator = (0, _parser.parser)('operator', satisfy(function (v) {
  return '+/-*%'.indexOf(v) > -1;
}));
var space = (0, _parser.parser)('space', satisfy(function (v) {
  return ' \t\n\r'.indexOf(v) > -1;
}));
var noneOf = function noneOf(s) {
  return (0, _parser.parser)('noneOf(\'' + s + '\')', satisfy(function (v) {
    return s.indexOf(v) === -1;
  }));
};

exports.space = space;
exports.char = char;
exports.letter = letter;
exports.digit = digit;
exports.alphaNum = alphaNum;
exports.operator = operator;
exports.noneOf = noneOf;