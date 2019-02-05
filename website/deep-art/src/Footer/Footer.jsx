import React, { Component } from 'react';

import styled from 'styled-components';

import globe from '../images/globe.svg';

const Footer = styled.footer`
  background-color: #f2f2f2;
  font-size: 12px;
  padding-top: 1rem;
  padding-bottom: 1rem;
  padding-right: 2.875rem;
  padding-left: 2.875rem;

  @media (min-width: 768px) {

  }
`;

const FooterDesc = styled.p`
  margin-bottom: 1rem;
  margin-top: 0;
`;

const LinkBig = styled.a`
  color: #000000;
  font-weight: 600;
  margin-left: 0.25rem;
  white-space: nowrap;
`;

const FooterLinks = styled.div`

  @media (min-width: 48em) {
    display: flex;
    justify-content: space-between;
  }
`;

const Lang = styled.div`
  align-items: center;
  color: #505050;
  display: flex;
  margin-bottom: 0.5rem;
  white-space: nowrap;

  @media (min-width: 48em) {
    margin-bottom: initial;
  }
`;

const LangImg = styled.img`
  margin-right: 0.5rem;
  height: 1rem;
  width: 1rem;
`;

const NoWrap = styled.span`
  white-space: nowrap;
`;

const Link = styled.a`
  display: block;
  color: #505050;
  margin-right: 1rem;
  text-decoration: none;
  white-space: nowrap;

  @media (min-width: 33.75em) {
    display: initial;
  }
`;

/**
 * The Navigational Bar across the top of the page
 */
export default class NavBar extends Component {
  render() {
    return (
      <Footer>
        <FooterDesc>
          Gen Studio is a prototype concept which was created over a two-day hackathon with
          collaborators across The Met, Microsoft, and MIT.
          <LinkBig hoverIndicator={true} href={'https://www.microsoft.com/inculture/arts/met-microsoft-mit-ai-open-access-hack'} target="_blank" rel="noopener">
            Click here to learn more.
          </LinkBig>
        </FooterDesc>
        <FooterLinks>
          <Lang>
            <LangImg src={globe} alt={"Language: English"} />
            <NoWrap>
              English (United States)
            </NoWrap>
          </Lang>
          <div>
            <Link href={'https://go.microsoft.com/fwlink/?LinkId=521839'} hoverIndicator={true} target="_blank" rel="noopener">Privacy &amp; Cookies</Link>
            <Link href={'https://go.microsoft.com/fwlink/?LinkID=206977'} hoverIndicator={true} target="_blank" rel="noopener">Terms of use</Link>
            <Link href={'https://www.microsoft.com/trademarks'} hoverIndicator={true} target="_blank" rel="noopener">Trademarks</Link>
            <Link href={'https://support.microsoft.com/en-us/contactus'} hoverIndicator={true} target="_blank" rel="noopener">Report abuse</Link>
            <NoWrap style={{whiteSpace: 'nowrap'}}>© Microsoft 2019</NoWrap>
          </div>
        </FooterLinks>
      </Footer>
    );
  }
}
