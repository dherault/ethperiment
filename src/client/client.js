import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import store from './state/store';
import web3 from './web3'; 
import App from './components/App';
import registerSideEffects from './registerSideEffects';

console.log('...', 'Hello client!', web3.isConnected() ? 'Connected': 'No connection');

// Enables side effects
registerSideEffects(store);

// Enables Webpack hot module replacement for reducers
// Does not work --> go for REACT HMRE
if (module.hot) module.hot.accept('./state/reducers.js', () => store.replaceReducer(require('./state/reducers.js')));

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
  () => console.log('...', 'App rendered!')
);
