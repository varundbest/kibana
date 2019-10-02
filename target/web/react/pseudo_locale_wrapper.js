"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PseudoLocaleWrapper = void 0;

var PropTypes = _interopRequireWildcard(require("prop-types"));

var React = _interopRequireWildcard(require("react"));

var i18n = _interopRequireWildcard(require("../core"));

var _pseudo_locale = require("../core/pseudo_locale");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * To translate label that includes nested `FormattedMessage` instances React Intl
 * replaces them with special placeholders (@__uid__@ELEMENT-uid-counter@__uid__@)
 * and maps them back with nested translations after `formatMessage` processes
 * original string, so we shouldn't modify these special placeholders with pseudo
 * translations otherwise React Intl won't be able to properly replace placeholders.
 * It's implementation detail of the React Intl, but since pseudo localization is dev
 * only feature we should be fine here.
 * @param message
 */
function translateFormattedMessageUsingPseudoLocale(message) {
  var formattedMessageDelimiter = message.match(/@__.{10}__@/);

  if (formattedMessageDelimiter !== null) {
    return message.split(formattedMessageDelimiter[0]).map(function (part) {
      return part.startsWith('ELEMENT-') ? part : (0, _pseudo_locale.translateUsingPseudoLocale)(part);
    }).join(formattedMessageDelimiter[0]);
  }

  return (0, _pseudo_locale.translateUsingPseudoLocale)(message);
}
/**
 * If the locale is our pseudo locale (e.g. en-xa), we override the
 * intl.formatMessage function to display scrambled characters. We are
 * overriding the context rather than using injectI18n, because the
 * latter creates a new React component, which causes React diffs to
 * be inefficient in some cases, and can cause React hooks to lose
 * their state.
 */


var PseudoLocaleWrapper =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(PseudoLocaleWrapper, _React$PureComponent);

  function PseudoLocaleWrapper(props, context) {
    var _this;

    _classCallCheck(this, PseudoLocaleWrapper);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PseudoLocaleWrapper).call(this, props, context));

    if ((0, _pseudo_locale.isPseudoLocale)(i18n.getLocale())) {
      var formatMessage = context.intl.formatMessage;

      context.intl.formatMessage = function () {
        return translateFormattedMessageUsingPseudoLocale(formatMessage.apply(void 0, arguments));
      };
    }

    return _this;
  }

  _createClass(PseudoLocaleWrapper, [{
    key: "render",
    value: function render() {
      return this.props.children;
    }
  }]);

  return PseudoLocaleWrapper;
}(React.PureComponent);

exports.PseudoLocaleWrapper = PseudoLocaleWrapper;

_defineProperty(PseudoLocaleWrapper, "propTypes", {
  children: PropTypes.element.isRequired
});

_defineProperty(PseudoLocaleWrapper, "contextTypes", {
  intl: PropTypes.object.isRequired
});