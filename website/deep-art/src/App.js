import React, { Component } from 'react';
import { Grommet, Box } from 'grommet';
import styled from "styled-components";

import {BrowserRouter as Router, Route, Link, Switch, Redirect} from 'react-router-dom';

import logo from './logo.svg';
import './App.css';

import SearchPage from './SearchPage/SearchPage.jsx';
import ExplorePage from './ExplorePage/ExplorePage.jsx';
import NavBar from './NavBar/NavBar.jsx';
import DogPage from './DogPage.jsx';

//GLOBAL THEME
const theme = {
  global: {
    font: {
      family: 'Roboto',
      size: '14px',
      height: '20px',
    },
  },
};



const Body = styled.section`

  height: fit-content;
`;

class App extends Component {
  render() {
    return (
      <Router>
        <Grommet theme={theme}>
          <Box
            direction="column"
          >
            <header>
              <NavBar />
            </header>
            <Body>
              <Route exact path="/" component={SearchPage}/>
              <Route exact path="/search" component={SearchPage}/>
              <Route exact path="/explore/:id" component={ExplorePage}/>
              <Route exact path="/dogs" component={DogPage}/>
            </Body>
          </Box>
        </Grommet>
      </Router>
    );
  }
}

export default App;
