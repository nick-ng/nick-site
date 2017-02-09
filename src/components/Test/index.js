import React, { PropTypes } from 'react';

export default function Test({ params }) {
  return (
    <div>
      <hr />
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
