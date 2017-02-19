import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import PostEditor from '../components/post-editor';
import { updatePostEditorContent, getPostEditorContent } from '../stores/post-editor';
import { updatePosts as updatePostsAction } from '../stores/posts';


const PostEditorContainer = ({ postContent, updatePostContent, updatePosts }) => (
  <PostEditor
    postContent={postContent}
    updatePostContent={updatePostContent}
    updatePosts={updatePosts}
  />
);

PostEditorContainer.propTypes = {
  postContent: PropTypes.string.isRequired,
  updatePostContent: PropTypes.func.isRequired,
  updatePosts: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    postContent: getPostEditorContent(state),
  }),
  dispatch => ({
    updatePostContent: postContent => dispatch(updatePostEditorContent(postContent)),
    updatePosts: newPost => dispatch(updatePostsAction(newPost)),
  }),
)(PostEditorContainer);
