'use strict';

var _chars = require('./chars');

var _numbers = require('./numbers');

var _combinators = require('./combinators');

var _strings = require('./strings');

var _state = require('./state');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require('./programming'),
    openBracket = _require.openBracket,
    closeBracket = _require.closeBracket,
    openBrace = _require.openBrace,
    closeBrace = _require.closeBrace,
    comma = _require.comma,
    string = _require.string;

var surroundedByBraces = (0, _combinators.between)(openBrace, closeBrace);
var surroundedByBracket = (0, _combinators.between)(openBracket, closeBracket);

function value(state) {
  return (0, _strings.lexeme)((0, _combinators.oneOf)(jsonObject, jsonArray, jsonString, jsonNumber))(state);
}

function jsonNumber(state) {
  return (0, _numbers.number)(state).return(parseInt);
}

function jsonString(state) {
  return string(state);
}

function jsonArray(state) {
  return surroundedByBracket((0, _combinators.sepBy1)((0, _chars.char)(','))(value))(state);
}

function keyValuePair(state) {
  return (0, _combinators.sequence)((0, _strings.lexeme)(string), (0, _combinators.skip)((0, _chars.char)(':')), value)(state).return(function (v) {
    return _defineProperty({}, v[0], v[1]);
  });
}

function jsonObject(state) {
  var list = (0, _combinators.sepBy1)((0, _strings.lexeme)(comma))(keyValuePair);
  return surroundedByBraces(list)(state).return(function (list) {
    return Object.assign.apply(Object, [{}].concat(_toConsumableArray(list)));
  });
}

var state = (0, _state.createState)({
  input: '\n    {\n      "hello": "world",\n      "age": 22,\n      "friends": [\n        {\n          "name": "john", "age": 32\n        }\n      ]\n    }\n  '
});

var parser = value;
console.log(JSON.stringify(parser(state).value, null, 2));

/**
{
  "column": 1,
  "line": 1,
  "input": "",
  "return": {
    "hello": "world",
    "age": 22,
    "friends": [
      {
        "name": "john",
        "age": 32
      }
    ]
  },
  "error": null
}
*/