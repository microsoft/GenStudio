import React, { Component } from 'react';
import { Grommet, Box } from 'grommet';
import { grommet } from "grommet/themes";
import {deepMerge} from "grommet/utils";
import styled from "styled-components";

import {BrowserRouter as Router, Route} from 'react-router-dom';
import './App.css';

import SelectPage from './SelectPage/SelectPage.jsx';
import ExplorePage from './ExplorePage/ExplorePage.jsx';
import SearchPage from './SearchPage/SearchPage.jsx';
import MapPage from './MapPage/MapPage.jsx';
import NavBar from './NavBar/NavBar.jsx';
import Claim from './Claim/Claim.jsx'
import Footer from './Footer/Footer.jsx';

//GLOBAL THEME
const gTheme = {
  global: {
    font: {
      family: 'Segoe UI',
      size: '14px',
      height: '20px',
      color: '#383B3E',
    },
    colors: {
      //brand: "#E8E2D3",
      brand: "#383B3E",
      "accent-1": "#000000", //black
      "accent-5": "#d49e49", //mustardy
      "accent-2": "#383B3E", //font grey
      "accent-3": "#FFFFFF",
      "accent-4": "#FFF8DC", // yellow background
      "accent-6": "#000000",
    },
    control:{
      border:{
        radius: "12px"
      }
    },
    input:{
      weight: "550"
    }
  },
  button: {
    border: {
      color: "accent-1",
      width: "1.5px",
    },
  },
  select: {
    icons: {
      color: "accent-2"
    },
  },
  textInput: {
    extend: {
      "border-color": "#a4a4a4",
      "border-width": "1.5px",
      "box-shadow": "0px 0px #a4a4a4",
    }
  },
  checkBox: {
    toggle: {
      color: "brand"
    }
  }
};

const mergeTheme = deepMerge(grommet, gTheme);

class App extends Component {
  render() {
    return (
      <Router style={{height: "100%", width: "100%"}}>
        <Grommet theme={mergeTheme}>
          <Box
            direction="column"
            style={{height: "100%", width: "100%"}}
          >
            <main className="main" role="main">
              <NavBar />
              <Claim />
              <Route exact path="/" component={SelectPage}/>
              <Route exact path="/select" component={SelectPage}/>
              <Route exact path="/explore/:id" component={ExplorePage}/>
              <Route exact path="/map/:id" component={MapPage}/>
              <Route exact path="/search/:id" component={SearchPage}/>
              <Route exact path="/search" component={SearchPage}/>
            </main>
            <Footer/>
          </Box>
        </Grommet>
      </Router>
    );
  }
}

export default App;
