import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import css from './styles.css';

export default function BlogEntry({ number }) {
  return (
    <div
      className={css.blogStyle}
    >
      <Link to={`test/${number}`}>{`Test #${number}`}</Link>
      <hr />
    </div>
  );
}

BlogEntry.propTypes = {
  number: PropTypes.number.isRequired,
};
