import { compose, createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';

import items from './modules/items';

const middlewares = [thunkMiddleware];

const reducer = combineReducers({
  items,
});

const store = compose(
  applyMiddleware(...middlewares),
  global.reduxNativeDevTools ? global.reduxNativeDevTools() : noop => noop,
)(createStore)(reducer);

export default store;
