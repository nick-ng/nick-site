import React, { PropTypes } from 'react';
import NavLink from '../NavLink';

export default function Nav(props) {
  return (
    <div className={props.className}>
      <NavLink to="/" onlyActiveOnIndex>Blog Page</NavLink>
      <NavLink to="/test/">Test Page Zero</NavLink>
    </div>
  );
}

Nav.propTypes = {
  className: PropTypes.string,
};

Nav.defaultProps = {
  className: undefined,
};
