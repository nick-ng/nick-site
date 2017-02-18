import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import posts from './posts';
import postEditor from './postEditor';

export default combineReducers({
  routing,
  posts,
  postEditor,
});
