import * as PropTypes from 'prop-types';
import * as React from 'react';
/**
 * If the locale is our pseudo locale (e.g. en-xa), we override the
 * intl.formatMessage function to display scrambled characters. We are
 * overriding the context rather than using injectI18n, because the
 * latter creates a new React component, which causes React diffs to
 * be inefficient in some cases, and can cause React hooks to lose
 * their state.
 */
export declare class PseudoLocaleWrapper extends React.PureComponent {
    static propTypes: {
        children: PropTypes.Validator<PropTypes.ReactElementLike>;
    };
    static contextTypes: {
        intl: PropTypes.Validator<object>;
    };
    constructor(props: {
        children: React.ReactNode;
    }, context: any);
    render(): React.ReactNode;
}
//# sourceMappingURL=pseudo_locale_wrapper.d.ts.map