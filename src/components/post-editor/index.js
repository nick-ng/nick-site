import React, { PropTypes } from 'react';
import TextareaAutosize from 'react-autosize-textarea';

import css from './styles.css';
import PostDisplayer from '../post-displayer';
import postService from '../../services/post-service';

const PostEditor = ({ postContent, updatePostContent, updatePosts }) => {
  const submitPost = () => updatePosts(postService.makePost(postContent));
  return (
    <div className={css.editorStyle}>
      <div className={css.controlsStyle}>
        <button onClick={submitPost}>Save Post</button>
        <TextareaAutosize
          className={css.textareaStyle}
          value={postContent}
          onChange={e => updatePostContent(e.target.value)}
          rows={5}
        />
        <div><button onClick={submitPost}>Save Post</button></div>
      </div>
      <PostDisplayer
        className={css.displayStyle}
        postContent={postContent}
      />
    </div>
  );
};

PostEditor.propTypes = {
  postContent: PropTypes.string.isRequired,
  updatePostContent: PropTypes.func.isRequired,
  updatePosts: PropTypes.func.isRequired,
};

export default PostEditor;
