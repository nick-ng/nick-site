import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import uuidV4 from 'uuid/v4';

import css from './styles.css';
import { getPosts, updatePosts as updatePostsAction } from '../../stores/posts';

const Test = ({ params, posts, updatePosts }) => (
  <div className={css.testStyle}>
    {`Test Component ${params.number ? params.number : 'Zero'}`}
    <hr />
    <div>{`Test ${JSON.stringify(posts.toJS())}`}</div>
    <button
      onClick={() => updatePosts({ id: uuidV4(), content: 'Hello World' })}
    >Click!
    </button>
  </div>
);

Test.propTypes = {
  params: PropTypes.objectOf(PropTypes.string),
  posts: ImmutablePropTypes.map.isRequired,
  updatePosts: PropTypes.func.isRequired,
};

Test.defaultProps = {
  params: {},
};

export default connect(
  state => ({
    posts: getPosts(state),
  }),
  dispatch => ({
    updatePosts: post => dispatch(updatePostsAction({ [post.id]: post })),
  }),
)(Test);
