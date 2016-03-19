import { createStore, combineReducers, compose, applyMiddleware } from 'redux';

import reducers from './reducers';
import promiseMiddleware from './promiseMiddleware';

const loggingMiddleware = () => next => action => { // Long live fun prog
  console.log('.R.', action.type, action.payload || '');
  next(action);
};

export default createStore(combineReducers(reducers), {}, compose(
  applyMiddleware(promiseMiddleware, loggingMiddleware),
  window.devToolsExtension ? window.devToolsExtension() : f => f
));
