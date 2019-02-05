import React, { Component } from 'react';

import styled from 'styled-components';

const LogoTitle = styled.h1`
  color: #000000;
  font-size: 46px;
  font-weight: 300;
  line-height: initial;
  margin-bottom: 1rem;
  margin-top: 0;
`;

/**
 * Logo component of the page
 */
export default class LogoText extends Component {
  render() {
    return <LogoTitle>Gen Studio</LogoTitle>;
  }
}
