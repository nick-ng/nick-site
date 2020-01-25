import React from 'react';
import { NavLink as NavLinkRRD } from 'react-router-dom';

import css from './styles.css';

const NavLink = (props) => (
    <NavLinkRRD
        className={css.navLink}
        activeClassName={css.activeNavLink}
        {...props}
    />
);

export default NavLink;
