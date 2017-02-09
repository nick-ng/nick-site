import React from 'react';
import NavLink from '../NavLink';

export default function Nav() {
  return (
    <div>
      <NavLink to="/" onlyActiveOnIndex>Blog Page</NavLink>
      <NavLink to="/test/">Test Page Zero</NavLink>
    </div>
  );
}
