import React, { Component } from 'react';
import { Grommet } from 'grommet';

import {BrowserRouter as Router, Route, Link, Switch, Redirect} from 'react-router-dom';

import logo from './logo.svg';
import './App.css';

import SearchPage from './SearchPage/SearchPage.jsx';
import ExplorePage from './ExplorePage/ExplorePage.jsx';
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

class App extends Component {
  render() {
    return (
      <Router>
        <Grommet theme={theme}>
          <Route exact path="/" component={SearchPage}/>
          <Route exact path="/search" component={SearchPage}/>
          <Route exact path="/explore" component={ExplorePage}/>
          <Route exact path="/dogs" component={DogPage}/>
        </Grommet>
      </Router>
    );
  }
}

export default App;
