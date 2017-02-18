import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

// import css from './styles.css';
import { updatePostEditorContent, getPostEditorContent } from '../../stores/postEditor';
import PostDisplayer from '../PostDisplayer';

const PostEditor = ({ postContent, updatePostContent }) => (
  <div>
    <textarea
      value={postContent}
      onChange={e => updatePostContent(e.target.value)}
    />
    <PostDisplayer postContent={postContent} />
  </div>
);

PostEditor.propTypes = {
  postContent: PropTypes.string.isRequired,
  updatePostContent: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    postContent: getPostEditorContent(state),
  }),
  dispatch => ({
    updatePostContent: postContent => dispatch(updatePostEditorContent(postContent)),
  }),
)(PostEditor);
