import { combineReducers } from 'redux';
import posts from './posts';
import postEditor from './post-editor';

export default combineReducers({
  posts,
  postEditor,
});
