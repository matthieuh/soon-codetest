import { compose, createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';

import item from './modules/item';

const middlewares = [thunkMiddleware];

const reducer = combineReducers({
  item,
});

const store = compose(
  applyMiddleware(...middlewares),
  global.reduxNativeDevTools ? global.reduxNativeDevTools() : noop => noop,
)(createStore)(reducer);

export default store;
