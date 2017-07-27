'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _parser = require('./parser');

var _state = require('./state');

var _combinators = require('./combinators');

var _chars = require('./chars');

var _strings = require('./strings');

var _numbers = require('./numbers');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

console.time('Parsing');


var bBraces = (0, _combinators.between)((0, _chars.char)('{'), (0, _chars.char)('}'));
var bBrackets = (0, _combinators.between)((0, _chars.char)('['), (0, _chars.char)(']'));
var bParens = (0, _combinators.between)((0, _chars.char)('('), (0, _chars.char)(')'));

var dash = (0, _chars.char)('-');
var comma = (0, _chars.char)(',');
var eol = (0, _chars.char)('$');
var bol = (0, _chars.char)('^');
var maybeOperator = (0, _chars.char)('?');
var or = (0, _chars.char)('|');
var plusOperator = (0, _chars.char)('+');
var timesOperator = (0, _chars.char)('*');

function rangeToParser(ranges) {
  var charParsers = ranges.map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        min = _ref2[0],
        max = _ref2[1];

    return (0, _chars.satisfy)(function (c) {
      return c >= min && c <= max;
    });
  });
  return _combinators.oneOf.apply(undefined, _toConsumableArray(charParsers));
}

function reRange() {
  return (0, _parser.parser)('.range', function (state) {
    return bBrackets((0, _combinators.many1)((0, _combinators.sequence)(_chars.alphaNum, (0, _combinators.skip)(dash), _chars.alphaNum)))(state);
  }, rangeToParser);
}

function reMaybe(dependencies) {
  return (0, _parser.parser)('maybe', function (state) {
    return (0, _combinators.sequence)((0, _combinators.oneOf)(reChar(dependencies), reRange(dependencies), reGroup(dependencies), reCapture(dependencies)), maybeOperator)(state);
  }, function (v) {
    return (0, _combinators.maybe)(v[0]);
  });
}

function reDep(dependencies) {
  return (0, _parser.parser)('dep', function (state) {
    return bBraces((0, _combinators.many)(_chars.alphaNum))(state);
  }, function (v) {
    var name = v.join('');
    if (!dependencies[name]) {
      throw new Error('No dependency found for name: ' + name);
    }
    return dependencies[name];
  });
}

function reAtom(dependencies) {
  return (0, _parser.parser)('atom', function (state) {
    return (0, _combinators.oneOf)(reDep(dependencies), reTimes(dependencies), reMany(dependencies), reMany1(dependencies), reMaybe(dependencies), reOr(dependencies), reRange(dependencies), reChar(dependencies), reGroup(dependencies))(state);
  });
}

function reMany1(dependencies) {
  return (0, _parser.parser)('many', function (state) {
    return (0, _combinators.sequence)((0, _combinators.oneOf)(reChar(dependencies), reRange(dependencies), reGroup(dependencies), reCapture(dependencies)), plusOperator)(state);
  }, function (v) {
    return (0, _combinators.many1)(v[0]);
  });
}

function reMany(dependencies) {
  return (0, _parser.parser)('many', function (state) {
    return (0, _combinators.sequence)((0, _combinators.oneOf)(reChar(dependencies), reRange(dependencies), reGroup(dependencies), reCapture(dependencies)), timesOperator)(state);
  }, function (v) {
    return (0, _combinators.many)(v[0]);
  });
}

function reTimes(dependencies) {
  return (0, _parser.parser)('times', function (state) {
    return (0, _combinators.sequence)((0, _combinators.oneOf)(reChar(dependencies), reRange(dependencies), reCapture(dependencies), reGroup(dependencies)), bBraces((0, _combinators.sequence)(_numbers.integer, (0, _combinators.skip)(comma), _numbers.integer)))(state);
  }, function (v) {
    return (0, _combinators.range)(v[1][0], v[1][1])(v[0]);
  });
}

function reChar() {
  return (0, _parser.parser)('symbol', _combinators.oneOf.apply(undefined, [_chars.alphaNum].concat(_toConsumableArray([':', '/', '.'].map(_chars.char)))), _chars.char);
}

function reParser(dependencies) {
  return (0, _parser.parser)('parser', function (state) {
    return (0, _strings.lexeme)((0, _combinators.many)((0, _combinators.oneOf)(reAtom(dependencies), reCapture(dependencies))))(state);
  }, function (v) {
    return v.length === 1 ? v[0] : _combinators.sequence.apply(undefined, _toConsumableArray(v));
  });
}

function reCapture(dependencies) {
  return (0, _parser.parser)('capture', (0, _combinators.between)((0, _strings.symbol)('{{'), (0, _strings.symbol)('}}'))((0, _combinators.sequence)((0, _combinators.many)(_chars.alphaNum), (0, _combinators.skip)((0, _chars.char)(':')), reAtom(dependencies))), function (v) {
    var _v = _slicedToArray(v, 2),
        name = _v[0],
        value = _v[1];

    name = name.join('');
    value = function (_value) {
      return function (state) {
        var ret = _value(state);
        return ret.store(_defineProperty({}, name, ret.value.return));
      };
    }(value);
    return value;
  });
}

function reGroup(dependencies) {
  return (0, _parser.parser)('group', function (state) {
    return bParens((0, _combinators.oneOf)(reParser(dependencies), reOr(dependencies)))(state);
  });
}

function reOr(dependencies) {
  return (0, _parser.parser)('or', function (state) {
    return (0, _combinators.sepBy1)(or)((0, _combinators.oneOf)(reDep(dependencies), reTimes(dependencies), reMany(dependencies), reMany1(dependencies), reMaybe(dependencies), reRange(dependencies), reChar(dependencies), reGroup(dependencies)))(state);
  }, function (v) {
    return v.length === 1 ? v[0] : _combinators.oneOf.apply(undefined, _toConsumableArray(v));
  });
}

function compile(name, source, ret, dependencies) {
  var state = (0, _state.createState)({ input: source });
  var result = reParser(dependencies)(state);
  if (result.value.error) {
    throw new Error(result.value.error);
  }
  return (0, _parser.parser)(name, result.value.return, function (v, s) {
    return Object.assign({}, s.store, ret(v, s.store));
  });
}

var url = '{{protocol:((https?)|(tcp))}}?://(www.)?{{domain:[a-z0-9]+}}.{{extension:{extension}}}';
var extension = (0, _parser.parser)('extension', (0, _combinators.oneOf)((0, _strings.symbol)('fr'), (0, _strings.symbol)('com')));

var parse = compile('url', url, function (_, _ref3) {
  var domain = _ref3.domain,
      extension = _ref3.extension,
      protocol = _ref3.protocol;
  return {
    domain: domain.join(''),
    protocol: protocol.join('')
  };
}, { extension: extension });

console.log(parse((0, _state.createState)({ input: 'http://google.com' })).value.return);
console.timeEnd('Parsing');