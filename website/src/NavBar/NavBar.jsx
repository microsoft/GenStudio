import React from 'react';

import { withNamespaces } from 'react-i18next';

import logo from '../images/mit-gen-logo.png';

/**
 * The Navigational Bar across the top of the page
 */
function NavBar({ t }) {
  return (
    <nav className="nav">
      <a className="nav__link" href="/">
        <img src={logo} alt=""/>
      </a>
    </nav>
  );
}

export default withNamespaces()(NavBar);
