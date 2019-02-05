import React, { Component } from 'react';

import styled from 'styled-components';

import search from './../images/search.svg';

const Nav = styled.nav`
  align-items: center;
  display: flex;
  height: 3.125rem;
  justify-content: space-between;
  margin-bottom: 1.25rem;
`;

const Link = styled.a`
  color: #000000;
  font-size: 1.25rem;
`;

const Search = styled.a`
  align-items: center;
  border: 1px solid #d2d2d2;
  border-radius: 1.5rem;
  color: #505050;
  display: flex;
  height: 2.125rem;
  justify-content: space-between;
  padding-left: 1rem;
  padding-right: 1rem;
  text-decoration: none;
  width: 15rem;
`;

const SearchIcon = styled.img`
  margin-left: 0.5rem;
  height: 1.25rem;
  width: 1.25rem;
`;

const SearchDesc = styled.span`
  font-size: 0.75rem;
  white-space: nowrap;
`;

/**
 * The Navigational Bar across the top of the page
 */
export default class NavBar extends Component {
  render() {
    return (
      <Nav>
        <Link hoverIndicator="false" style={{ textDecoration: 'none' }} href={'/'}>Gen Studio</Link>
        <Search href="/">
          <SearchDesc>Explore the MET Collection</SearchDesc>
          <SearchIcon src={search} alt={'Explore the MET Collection'} />
        </Search>
      </Nav>
    );
  }
}
