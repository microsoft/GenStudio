import React from 'react';
import ReactDOM from 'react-dom';
import './main.scss';
import './i18n';

import App from './App';
import * as serviceWorker from './serviceWorker';

import ReactAI from 'react-appinsights';
ReactAI.init({instrumentationKey:'4f750fc5-13d7-4145-84a6-a528aec1f9f6'});
ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

