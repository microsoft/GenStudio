import React, { Component } from 'react';

import {BrowserRouter as Router, Route} from 'react-router-dom';
import './App.css';

import SelectPage from './SelectPage/SelectPage.jsx';
import ExplorePage from './ExplorePage/ExplorePage.jsx';
import SearchPage from './SearchPage/SearchPage.jsx';
import MapPage from './MapPage/MapPage.jsx';
import NavBar from './NavBar/NavBar.jsx';
import Footer from './Footer/Footer.jsx';

class App extends Component {
  render() {
    return (
      <Router>
        <React.Fragment>
          <NavBar />
          <main className="main" role="main">
            <Route exact path="/" component={SelectPage}/>
            <Route exact path="/select" component={SelectPage}/>
            <Route exact path="/explore/:id" component={ExplorePage}/>
            <Route exact path="/map/:id" component={MapPage}/>
            <Route exact path="/search/:id" component={SearchPage}/>
            <Route exact path="/search" component={SearchPage}/>
          </main>
          <Footer/>
        </React.Fragment>
      </Router>
    );
  }
}

export default App;
