import { createReducer } from 'redux-immutable';
import { createSelector } from 'reselect';
import Immutable from 'immutable';

import { UPDATE_POSTS } from './constants';

const initialState = Immutable.fromJS({
  posts: {},
});

// Actions
export const updatePosts = posts => dispatch =>
  dispatch({ type: UPDATE_POSTS, payload: { posts } });

// Reducer
export default createReducer(initialState, {
  [UPDATE_POSTS]: (state, action) => state.updateIn('posts', posts => posts.merge(action.payload.posts)),
});

// Selectors
const posts = state => state.posts;

export const getPosts = createSelector(
  posts,
  p => p.get('posts'),
);
