import React from 'react';

import NavLink from './nav-link';

import css from './styles.css';

const Nav = () => (
    <div className={css.navContainer}>
        <NavLink emoji="🏠" to="/" exact>
            Home
        </NavLink>
        <NavLink emoji="👰🤵" to="/wedding">
            Wedding Album
        </NavLink>
        <NavLink emoji="📷" to="/wedding/photos" indentLevel={1}>
            Photos
        </NavLink>
        <NavLink emoji="🧩" to="/pll">
            Rubik's Cube
        </NavLink>
        <NavLink emoji="🧩" to="/pll" indentLevel={1}>
            PLL Algorithms
        </NavLink>
        {/* <NavLink emoji="🧭" to="/location">
            Location
        </NavLink> */}
    </div>
);

export default Nav;
