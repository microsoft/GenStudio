import React, { Component } from 'react';

import {BrowserRouter as Router, Route, Link, Switch, Redirect} from 'react-router-dom';

import logo from './logo.svg';
import './App.css';

import SearchPage from './SearchPage/SearchPage.jsx';
import ExplorePage from './ExplorePage/ExplorePage.jsx';
import DogPage from './DogPage.jsx';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={SearchPage}/>
          <Route exact path="/search" component={SearchPage}/>
          <Route exact path="/explore" component={ExplorePage}/>
          <Route exact path="/dogs" component={DogPage}/>
        </div>
      </Router>
    );
  }
}

export default App;
