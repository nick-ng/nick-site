import React, { PropTypes } from 'react';
import ReactMarkdown from 'react-markdown';

// import css from './styles.css';

const PostDisplayer = ({ postContent, className }) => (
  <div className={className}>
    <ReactMarkdown source={postContent} escapeHtml />
    <div>{postContent}</div>
  </div>
);

PostDisplayer.propTypes = {
  postContent: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
};

PostDisplayer.defaultProps = {
  className: '',
};

export default PostDisplayer;
