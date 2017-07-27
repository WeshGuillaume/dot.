'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.float = exports.integer = exports.number = undefined;

var _parser = require('./parser');

var _chars = require('./chars');

var _combinators = require('./combinators');

var integer = (0, _parser.parser)('integer', function (state) {
  return (0, _combinators.many1)(_chars.digit)(state).return(function (value) {
    return value.join('');
  });
});

var float = (0, _parser.parser)('float', function (state) {
  return (0, _combinators.sequence)(integer, (0, _chars.char)('.'), integer)(state).return(function (value) {
    return value.join('');
  });
});

var number = (0, _parser.parser)('number', (0, _combinators.oneOf)(float, integer));

exports.number = number;
exports.integer = integer;
exports.float = float;