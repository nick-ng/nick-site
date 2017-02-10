import React, { PropTypes } from 'react';

import css from './styles.css';
import Nav from '../Nav';

export default function App({ children }) {
  return (
    <div>
      <h1 className={css.heading}>
        Nick Ng
      </h1>
      <div className={css.mainStyle}>
        <Nav className={css.navStyle} />
        <div className={css.contentStyle}>{children}</div>
      </div>
    </div>
  );
}

App.propTypes = {
  children: PropTypes.node,
};

App.defaultProps = {
  children: <div />,
};
