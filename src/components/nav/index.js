import React from 'react';

import NavLink from './nav-link';

import css from './styles.css';

const Nav = () => (
  <div className={css.navContainer}>
    <NavLink to="/" exact>Home</NavLink>
    <NavLink to="/wedding">Wedding Photos</NavLink>
    <NavLink to="/pll">Rubik's Cube PLL Algorithms</NavLink>
  </div>
);

export default Nav;