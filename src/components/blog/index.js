import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import css from './styles.css';
import BlogEntry from './blog-entry';

const sortFunc = (postA, postB) =>
  postB.get('postDate') - postA.get('postDate');

export default function Blog({ posts }) {
  return (
    <div className={css.blogStyle}>
      {posts.toList().sort(sortFunc).map((post, index) => (
        <BlogEntry
          key={`blogEntry${post.get('id')}`}
          renderNumber={index}
          post={post}
        />
      ))}
    </div>
  );
}

Blog.propTypes = {
  posts: ImmutablePropTypes.map.isRequired,
};
