import React from 'react';

import NavLink from './nav-link';

import css from './styles.css';

const Nav = () => (
  <div className={css.navContainer}>
    <NavLink to="/" exact>Home</NavLink>
    <NavLink to="/wedding">Wedding Album</NavLink>
    <NavLink to="/wedding/photos" indentLevel={1}>Photos</NavLink>
    <NavLink to="/pll">Rubik's Cube</NavLink>
    <NavLink to="/pll" indentLevel={1}>PLL Algorithms</NavLink>
  </div>
);

export default Nav;
