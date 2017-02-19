import React, { PropTypes } from 'react';

import css from './styles.css';
import PostDisplayer from '../../post-displayer';

export default function BlogEntry({ content, renderNumber }) {
  return (
    <div className={css.blogStyle}>
      {renderNumber !== 0 && <hr />}
      <PostDisplayer
        postContent={content}
      />
    </div>
  );
}

BlogEntry.propTypes = {
  content: PropTypes.string.isRequired,
  renderNumber: PropTypes.number,
};

BlogEntry.defaultProps = {
  renderNumber: 1,
};
