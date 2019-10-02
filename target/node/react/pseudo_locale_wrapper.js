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
  const formattedMessageDelimiter = message.match(/@__.{10}__@/);

  if (formattedMessageDelimiter !== null) {
    return message.split(formattedMessageDelimiter[0]).map(part => part.startsWith('ELEMENT-') ? part : (0, _pseudo_locale.translateUsingPseudoLocale)(part)).join(formattedMessageDelimiter[0]);
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


class PseudoLocaleWrapper extends React.PureComponent {
  constructor(props, context) {
    super(props, context);

    if ((0, _pseudo_locale.isPseudoLocale)(i18n.getLocale())) {
      const formatMessage = context.intl.formatMessage;

      context.intl.formatMessage = (...args) => translateFormattedMessageUsingPseudoLocale(formatMessage(...args));
    }
  }

  render() {
    return this.props.children;
  }

}

exports.PseudoLocaleWrapper = PseudoLocaleWrapper;

_defineProperty(PseudoLocaleWrapper, "propTypes", {
  children: PropTypes.element.isRequired
});

_defineProperty(PseudoLocaleWrapper, "contextTypes", {
  intl: PropTypes.object.isRequired
});