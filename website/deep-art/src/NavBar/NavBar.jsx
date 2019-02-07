import React from 'react';

import { withNamespaces } from 'react-i18next';

/**
 * The Navigational Bar across the top of the page
 */
function NavBar({ t }) {
  return (
    <nav className="nav">
      <a className="nav__link" href="/">
        <span>{t('global.title')}</span>
      </a>
    </nav>
  );
}

export default withNamespaces()(NavBar);
