import { createReducer } from 'redux-immutablejs';
import { createSelector } from 'reselect';
import Immutable from 'immutable';

import constants from './constants';

// Constants
const { UPDATE_POSTS } = constants;

const initialState = Immutable.fromJS({
  posts: {},
});

// Actions
export function updatePosts(posts) {
  return dispatch =>
    dispatch({ type: UPDATE_POSTS, payload: { posts } });
}

// Reducer
export default createReducer(initialState, {
  [UPDATE_POSTS]: (state, action) => state.updateIn(['posts'], posts => posts.merge(action.payload.posts)),
});

// Selectors
const posts = state => state.posts;

export const getPosts = createSelector(
  posts,
  p => p.get('posts'),
);
