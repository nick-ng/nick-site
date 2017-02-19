import { createReducer } from 'redux-immutablejs';
import { createSelector } from 'reselect';
import Immutable from 'immutable';

import constants from './constants';

// Constants
const {
  EDITOR_POST_EDIT,
} = constants;

// Initial State
const initialState = Immutable.fromJS({
  postEditorContent: '',
});

// Actions
export const updatePostEditorContent = postContent => dispatch =>
  dispatch({ type: EDITOR_POST_EDIT, payload: { postContent } });

// Reducer
export default createReducer(initialState, {
  [EDITOR_POST_EDIT]: (state, action) => state.set('postEditorContent', action.payload.postContent),
});

// Selectors
const postEditor = state => state.postEditor;

export const getPostEditorContent = createSelector(
  postEditor,
  p => p.get('postEditorContent'),
);
