import React, { PropTypes } from 'react';
import css from './styles.css';

export default function BlogEntry({ number }) {
  return (
    <div
      className={css.blogStyle}
    >
      {`Test #${number}`}
      <hr />
    </div>
  );
}

BlogEntry.propTypes = {
  number: PropTypes.number.isRequired,
};
