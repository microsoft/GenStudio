import React, { Component } from 'react';

import search from './../images/search.svg';

/**
 * The Navigational Bar across the top of the page
 */
export default class NavBar extends Component {
  render() {
    return (
      <nav className="nav">
        <a className="nav__link" href="/">Gen Studio</a>
        <a className="nav__btn" href="/search/1">
          <span className="nav__text">Explore the MET Collection</span>
          <img className="nav__img" src={search} alt={'Explore the MET Collection'} />
        </a>
      </nav>
    );
  }
}
