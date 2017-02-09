import React, { PropTypes } from 'react';

import Nav from '../Nav';

export default function App({ children }) {
  return (
    <div>
      <h1>
        Nick Ng
      </h1>
      <Nav />
      <div>{children}</div>
    </div>
  );
}

App.propTypes = {
  children: PropTypes.node,
};

App.defaultProps = {
  children: <div />,
};
