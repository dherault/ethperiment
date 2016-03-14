import React from 'react';
import { render } from 'react-dom';
import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'

import promiseMiddleware from './promiseMiddleware';
import App from './components/App';
import web3 from './web3'; 
import reducers from './reducers';
import appConfig from '../config.json';
import {
  getAccounts,
  getBalance,
} from './web3Wrappers';

const defaultAccount = web3.eth.defaultAccount;
console.log('Hello client!', web3.isConnected() ? 'Connected': 'No connection');
console.log(defaultAccount ? `defaultAccount: ${defaultAccount}` : 'No default account found');

const store = createStore(combineReducers(reducers), {}, compose(
  applyMiddleware(promiseMiddleware),
  window.devToolsExtension ? window.devToolsExtension() : f => f
));
  
// Enables Webpack hot module replacement for reducers
if (module.hot) module.hot.accept('./reducers.js', () => store.replaceReducer(require('./reducers.js')));
  
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
