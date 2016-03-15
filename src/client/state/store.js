import { createStore, combineReducers, compose, applyMiddleware } from 'redux';

import reducers from './reducers';
import promiseMiddleware from './promiseMiddleware';

export default createStore(combineReducers(reducers), {}, compose(
  applyMiddleware(promiseMiddleware),
  window.devToolsExtension ? window.devToolsExtension() : f => f
));
