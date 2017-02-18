import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import css from './styles.css';
import { getPosts, updatePosts } from '../../stores/posts';

const Test = ({ params }) => (
  <div className={css.testStyle}>
    {`Test Component ${params.number ? params.number : 'Zero'}`}
    <hr />
    <button
      onClick={() => {}}
    >Click!
    </button>
  </div>
);

Test.propTypes = {
  params: PropTypes.objectOf(PropTypes.string),
};

Test.defaultProps = {
  params: {},
};

export default connect(
  state => ({
    posts: getPosts(state),
  }),
  dispatch => ({
    updatePosts: post => dispatch(updatePosts({ [post.id]: post })),
  }),
)(Test);
