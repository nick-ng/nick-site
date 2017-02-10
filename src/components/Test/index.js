import React, { PropTypes } from 'react';

import css from './styles.css';

export default function Test({ params }) {
  return (
    <div className={css.testStyle}>
      {`Test Component ${params.number ? params.number : 'Zero'}`}
      <hr />
    </div>
  );
}

Test.propTypes = {
  params: PropTypes.objectOf(PropTypes.string),
};

Test.defaultProps = {
  params: {},
};
