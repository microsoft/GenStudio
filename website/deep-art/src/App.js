import React, { Component } from 'react';
import { Grommet, Box, TextInput } from 'grommet';
import { grommet } from "grommet/themes";
import {deepMerge} from "grommet/utils";
import styled from "styled-components";

import {BrowserRouter as Router, Route, Link, Switch, Redirect} from 'react-router-dom';
import './App.css';

import SearchPage from './SearchPage/SearchPage.jsx';
import ExplorePage from './ExplorePage/ExplorePage.jsx';
import GraphPage from './GraphPage/GraphPage.jsx';
import NavBar from './NavBar/NavBar.jsx';
import DogPage from './DogPage.jsx';

//GLOBAL THEME
const gTheme = {
  global: {
    font: {
      family: 'Roboto',
      size: '14px',
      height: '20px',
      color: '#383B3E',
    },
    colors: {
      brand: "#DFD8BF",
      "accent-1": "#d49e49", //mustardy
      "accent-2": "#745c74", //purple
      "accent-3": "#c59661",
    },
    control:{
      border:{
        radius: "12px"
      }
    }
  },
  button: {
    border: {
      color: "accent-1"
    },
  },
  select: {
    icons: {
      color: "accent-1"
    },
  },
  textInput: {
    extend: {
      "border-color": "#d49e49",
      "box-shadow": "0px 0px #d49e49",
    }
  }
};

const mergeTheme = deepMerge(grommet, gTheme);


const Body = styled.section`
  height: 100%;
  background: #F1F1D4;
  z-Index: 0;
`;

class App extends Component {
  render() {
    return (
      <Router style={{height: "100%"}}>
        <Grommet theme={mergeTheme}>
          <Box
            direction="column"
            style={{height: "100%"}}
          >
            <header style={{zIndex: "1"}}>
              <NavBar />
            </header>
            <Body>
              <Route exact path="/" component={SearchPage}/>
              <Route exact path="/search" component={SearchPage}/>
              <Route exact path="/explore/:id" component={ExplorePage}/>
              <Route exact path="/graph" component={GraphPage}/>
              <Route exact path="/dogs" component={DogPage}/>
            </Body>
          </Box>
        </Grommet>
      </Router>
    );
  }
}

export default App;
