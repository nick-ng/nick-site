import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import postReducer from './posts';

export default combineReducers({
  routing: routerReducer,
  posts: postReducer,
});
