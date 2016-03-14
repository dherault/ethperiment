import React from 'react';
import { render } from 'react-dom';
import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'

import web3 from './web3'; 
import App from './components/App';
import reducers from './reducers';
import promiseMiddleware from './promiseMiddleware';
import registerSideEffects from './registerSideEffects';

// Some checks at startup
const defaultAccount = web3.eth.defaultAccount;
console.log('...', 'Hello client!', web3.isConnected() ? 'Connected': 'No connection');
console.log('...', defaultAccount ? `defaultAccount: ${defaultAccount}` : 'No default account found');

// Redux store creation (a bit overkill for this small app)
const store = createStore(combineReducers(reducers), {}, compose(
  applyMiddleware(promiseMiddleware),
  window.devToolsExtension ? window.devToolsExtension() : f => f
));

registerSideEffects(store);
  
// Enables Webpack hot module replacement for reducers
if (module.hot) module.hot.accept('./reducers.js', () => store.replaceReducer(require('./reducers.js')));

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
  () => console.log('...', 'App rendered!')
);
