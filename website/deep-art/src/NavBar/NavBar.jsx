import React, { Component } from 'react';

import { withNamespaces } from 'react-i18next';

import search from './../images/search.svg';

/**
 * The Navigational Bar across the top of the page
 */
function NavBar({ t }) {
  return (
    <nav className="nav">
      <a className="nav__link" href="/">
        {t('global.title')}
      </a>
      <a className="nav__btn" href="/search/1">
        <span className="nav__text">{t('nav.explore')}</span>
        <img className="nav__img" src={search} alt={t('nav.explore')} />
      </a>
    </nav>
  );
}

export default withNamespaces()(NavBar);
