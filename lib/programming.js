'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.string = exports.semi = exports.comma = exports.closeBrace = exports.openBrace = exports.closeBracket = exports.openBracket = undefined;

var _chars = require('./chars');

var _parser = require('./parser');

var _strings = require('./strings');

var _require = require('./combinators'),
    many = _require.many,
    between = _require.between,
    sequence = _require.sequence;

var openBrace = (0, _chars.char)('{');
var closeBrace = (0, _chars.char)('}');
var openBracket = (0, _chars.char)('[');
var closeBracket = (0, _chars.char)(']');
var comma = (0, _chars.char)(',');
var semi = (0, _chars.char)(';');

var string = (0, _parser.parser)('a string', function (state) {
  return between((0, _chars.char)('"'), (0, _chars.char)('"'))(many((0, _chars.noneOf)('"')))(state).return(function (value) {
    return value.join('');
  });
});

exports.openBracket = openBracket;
exports.closeBracket = closeBracket;
exports.openBrace = openBrace;
exports.closeBrace = closeBrace;
exports.comma = comma;
exports.semi = semi;
exports.string = string;