import React from 'react';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Blog from '../components/blog';
import { getPosts } from '../stores/posts';


const BlogContainer = ({ posts }) => (
  <Blog
    posts={posts}
  />
);

BlogContainer.propTypes = {
  posts: ImmutablePropTypes.map.isRequired,
};

export default connect(
  state => ({
    posts: getPosts(state),
  }),
  {},
)(BlogContainer);
