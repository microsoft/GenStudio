import React, { Component } from 'react';

import globe from '../images/globe.svg';

/**
 * The Navigational Bar across the top of the page
 */
export default class NavBar extends Component {
  render() {
    return (
      <footer className="foo">
        <p className="foo__desc">
          Gen Studio is a prototype concept which was created over a two-day hackathon with
          collaborators across The Met, Microsoft, and MIT.
          <a className="foo__link foo__link--strong" hoverIndicator={true} href={'https://www.microsoft.com/inculture/arts/met-microsoft-mit-ai-open-access-hack'} target="_blank" rel="noopener">
            Click here to learn more.
          </a>
        </p>
        <div className="foo__links">
          <div className="foo__lang">
            <img className="foo__img" src={globe} alt={"Language: English"} />
            <span className="u-nowrap">English (United States)</span>
          </div>
          <div>
            <a className="foo__link" href="https://go.microsoft.com/fwlink/?LinkId=521839" target="_blank" rel="noopener">Privacy &amp; Cookies</a>
            <a className="foo__link" href="https://go.microsoft.com/fwlink/?LinkID=206977" target="_blank" rel="noopener">Terms of use</a>
            <a className="foo__link" href="https://www.microsoft.com/trademarks" target="_blank" rel="noopener">Trademarks</a>
            <a className="foo__link" href="https://support.microsoft.com/en-us/contactus" target="_blank" rel="noopener">Report abuse</a>
            <span className="u-nowrap">© Microsoft 2019</span>
          </div>
        </div>
      </footer>
    );
  }
}
