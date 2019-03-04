import React from 'react';

import { withNamespaces } from 'react-i18next';

import globe from '../images/icon-earth.svg';

/**
 * The Navigational Bar across the top of the page
 */
function NavBar({ t }) {
    return (
      <footer className="footer">
        <p className="footer__description">
          <span>Gen Studio is an experimental collaboration across The Met, Microsoft, and MIT. Learn more about the <a href="https://www.microsoft.com/inculture/arts/met-microsoft-mit-ai-open-access-hack/" target="_blank" rel="noopener noreferrer"> collaboration</a> and The Met’s <a href="https://www.metmuseum.org/blogs/now-at-the-met/2019/met-microsoft-mit-art-open-data-artificial-intelligence" target="_blank" rel="noopener noreferrer"> Open Access Program</a>. View the source code <a href="https://github.com/Microsoft/deep-art" target="_blank" rel="noopener noreferrer">here</a>.</span>
          {/* <a className="footer__link footer__link--strong" href={'https://www.microsoft.com/inculture/arts/met-microsoft-mit-ai-open-access-hack'} target="_blank" rel="noopener noreferrer">
            {t('global.learn_more')}
          </a> */}
        </p>
        <div className="footer__divider"></div>
        <div className="footer__links">
          <div className="footer__lang">
            <img className="footer__image" src={globe} alt={t('global.lang_eng')} />
            <span className="u-nowrap">{t('global.lang_eng_description_us')}</span>
          </div>
          <div>
            <a className="footer__link" href="https://support.microsoft.com/en-us/contactus" target="_blank" rel="noopener noreferrer">{t('foo.report_abuse')}</a>
          </div>
        </div>
      </footer>
  );
}

export default withNamespaces()(NavBar);
