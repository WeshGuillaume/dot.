'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.range = exports.skipMany = exports.skip = exports.oneOf = exports.sequence = exports.between = exports.sepBy1 = exports.sepBy = exports.many = exports.many1 = exports.maybe = undefined;

var _errors = require('./errors');

var _parser = require('./parser');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Combinators
 * ----------------------------------------------------------------------------
 */

/**
 * maybe
 *
 * takes a parser, try to consume the input. If it succeed, go ahead, otherwise,
 * rollback
 */
function maybe(p) {
  return (0, _parser.parser)('maybe(' + p.parserName + ')', function (state) {
    var ret = p(state);
    return ret.value.error ? state.return(function () {
      return _errors.NO_MATCH;
    }) : ret;
  });
}

function range() {
  var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var max = arguments[1];

  return function (p) {
    return (0, _parser.parser)('range(' + min + ', ' + max + ')(' + p.parserName + ')', function (state) {
      var first = min === 0 ? state.return(function (v) {
        return [];
      }) : sequence.apply(undefined, _toConsumableArray(new Array(min).fill(0).map(function () {
        return p;
      })))(state);

      if (first.value.error) {
        return first;
      }

      while (min < max) {
        var out = p(first);
        if (out.value.error) {
          return first;
        }
        first = out.return(function (v) {
          return [].concat(_toConsumableArray(first.value.return), [v]);
        });
        min += 1;
      }

      return first;
    });
  };
}

function sequenceOne(state, parser) {
  if (!!state.value.error) {
    return state;
  }
  var ret = parser(state.clone());
  if (!!ret.value.error) {
    return ret;
  }
  return state.setState({
    return: [].concat(_toConsumableArray(state.value.return), _toConsumableArray(ret.value.return === _errors.NO_MATCH ? [] : [ret.value.return])),
    input: ret.value.input
  });
}

/**
 * sequence
 *
 * consume a sequence of parsers in order, return a array of match
 * it also make sure to remove the NO_MATCH due to maybe parsers
 */
function sequence() {
  for (var _len = arguments.length, ps = Array(_len), _key = 0; _key < _len; _key++) {
    ps[_key] = arguments[_key];
  }

  return (0, _parser.parser)('sequence(' + ps.map(function (_ref) {
    var parserName = _ref.parserName;
    return parserName;
  }).join(', ') + ')', function (state) {
    return ps.reduce(function (s, p) {
      return p(s).return(function (v) {
        return [].concat(_toConsumableArray(s.value.return), [v]);
      });
    }, state.return(function () {
      return [];
    }));
  }, function (v) {
    return v.filter(function (e) {
      return e !== _errors.NO_MATCH;
    });
  }, false);
}

/**
 * oneOf
 *
 * takes a list of parser, apply them in order and return the first match
 */
function oneOf() {
  for (var _len2 = arguments.length, ps = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    ps[_key2] = arguments[_key2];
  }

  return (0, _parser.parser)('oneOf(' + ps.map(function (p) {
    return p.parserName;
  }).join(', ') + ')', function (state) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = ps.map(maybe)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var p = _step.value;

        var s = p(state);
        if (s.value.return !== _errors.NO_MATCH) {
          return s;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return state.error(new _errors.ParseError('Unexpected token: ' + state.value.input.charAt(0) + ', expected oneOf ' + ps.map(function (p) {
      return p.parserName;
    }).join(', '), state));
  });
}

/**
 * many
 *
 * parse zero or more occurence of the parser
 */
function many(p) {
  return (0, _parser.parser)('many(' + p.parserName + ')', function (state) {
    var ret = state.setState({ return: [] });
    while (true) {
      var out = p(ret);
      if (out.value.error) {
        return ret;
      }
      ret = out.return(function (value) {
        return [].concat(_toConsumableArray(ret.value.return), [value]);
      });
    }
  });
}

/**
 * many1
 *
 * parses one or more occurence of p using many
 */
function many1(p) {
  return (0, _parser.parser)('many1(' + p.parserName + ')', function (state) {
    var firstState = p(state);
    return many(p)(firstState).return(function (v) {
      return [firstState.value.return].concat(_toConsumableArray(v));
    });
  });
}

/**
 * between
 *
 * takes two delimiters and a parser,
 * return the parser match surrounded by the delimiters
 *
 * usage: between(char('('), char(')'))(symbol('Hello'))
 */
function between(p1, p2) {
  return function (p) {
    return (0, _parser.parser)('between(' + p1.parserName + ', ' + p2.parserName + ')(' + p.parserName + ')', function (state) {
      return sequence(skip(p1), p, skip(p2))(state).return(function (b) {
        return b[0];
      });
    });
  };
}

/**
 * sepBy
 *
 * return an array of zero or more occurence of p separated by sep
 */
function sepBy(sep) {
  return function (p) {
    return (0, _parser.parser)('sepBy(' + sep.parserName + ')(' + p.parserName + ')', function (state) {
      var s = sepBy1(sep)(p)(state);
      return s.value.error ? state.return(function () {
        return [];
      }) : s;
    });
  };
}

function prevent(sep, p) {
  return (0, _parser.parser)('prevent', function (state) {
    var test = sep(state);
    if (!test.value.error) {
      return state.error(new _errors.ParseError('Unexpected separator ' + sep.parserName));
    }
    return p(state);
  });
}

function sepBy1(sep) {
  return function (p) {
    return (0, _parser.parser)('sepBy1(' + sep.parserName + ')(' + p.parserName + ')', function (state) {
      var s = p(state);
      return many(sequence(skip(sep), prevent(sep, p)))(s).return(function (v) {
        return [s.value.return].concat(_toConsumableArray(v.map(function (e) {
          return e[0];
        })));
      });
    });
  };
}

function skip(p) {
  return (0, _parser.parser)('skip(' + p.parserName + ')', p, function () {
    return _errors.NO_MATCH;
  });
}

function skipMany(p) {
  return (0, _parser.parser)('skipMany(' + p.parserName + ')', function (state) {
    return skip(many(p))(state);
  });
}

exports.maybe = maybe;
exports.many1 = many1;
exports.many = many;
exports.sepBy = sepBy;
exports.sepBy1 = sepBy1;
exports.between = between;
exports.sequence = sequence;
exports.oneOf = oneOf;
exports.skip = skip;
exports.skipMany = skipMany;
exports.range = range;