'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NO_MATCH = 'NO_MATCH';

var ParseError = function (_Error) {
  _inherits(ParseError, _Error);

  function ParseError(message) {
    var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { value: {} };

    _classCallCheck(this, ParseError);

    var _this = _possibleConstructorReturn(this, (ParseError.__proto__ || Object.getPrototypeOf(ParseError)).call(this, '[ParseError]: ' + message + ': position: ' + state.value.line + ':' + (state.value.column + 1)));

    _this.type = 'ParseError';
    return _this;
  }

  return ParseError;
}(Error);

exports.NO_MATCH = NO_MATCH;
exports.ParseError = ParseError;