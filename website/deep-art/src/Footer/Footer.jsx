import React from 'react';

import { withNamespaces } from 'react-i18next';

import globe from '../images/globe.svg';

/**
 * The Navigational Bar across the top of the page
 */
function NavBar({ t }) {
    return (
      <footer className="foo">
        <p className="foo__desc">
          {t('foo.desc')}
          <a className="foo__link foo__link--strong" hoverIndicator={true} href={'https://www.microsoft.com/inculture/arts/met-microsoft-mit-ai-open-access-hack'} target="_blank" rel="noopener noreferrer">
            {t('global.learn_more')}
          </a>
        </p>
        <div className="foo__links">
          <div className="foo__lang">
            <img className="foo__img" src={globe} alt={t('global.lang_eng')} />
            <span className="u-nowrap">{t('global.lang_eng_description_us')}</span>
          </div>
          <div>
            <a className="foo__link" href="https://go.microsoft.com/fwlink/?LinkId=521839" target="_blank" rel="noopener noreferrer">{t('foo.privacy_cookies')}</a>
            <a className="foo__link" href="https://go.microsoft.com/fwlink/?LinkID=206977" target="_blank" rel="noopener noreferrer">{t('foo.terms_use')}</a>
            <a className="foo__link" href="https://www.microsoft.com/trademarks" target="_blank" rel="noopener noreferrer">{t('foo.trademarks')}</a>
            <a className="foo__link" href="https://support.microsoft.com/en-us/contactus" target="_blank" rel="noopener noreferrer">{t('foo.report_abuse')}</a>
            <span className="u-nowrap">{t('global.copyright')}</span>
          </div>
        </div>
      </footer>
  );
}

export default withNamespaces()(NavBar);
