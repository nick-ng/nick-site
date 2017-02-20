import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment';

import css from './styles.css';
import PostDisplayer from '../../post-displayer';

export default function BlogEntry({ post, renderNumber }) {
  return (
    <div className={css.itemStyle}>
      {renderNumber !== 0 && <hr />}
      <div className={css.postStyle}>
        <PostDisplayer
          className={css.contentStyle}
          postContent={post.get('content')}
        />
        {post.get('postDate') && <div className={css.dateStyle}>
          {moment(post.get('postDate')).format('ll')}
        </div>}
      </div>
    </div>
  );
}

BlogEntry.propTypes = {
  post: ImmutablePropTypes.map.isRequired,
  renderNumber: PropTypes.number,
};

BlogEntry.defaultProps = {
  renderNumber: 1,
};
