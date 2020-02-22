import React from 'react';

import Header from '../header';
import NavLink from './nav-link';

import css from './styles.css';

const hasAdminKey = () => Boolean(localStorage.getItem('adminKey'));

const Nav = () => (
    <div className={css.navContainer}>
        <Header />
        <NavLink icon="fa-home" to="/" exact>
            Home
        </NavLink>
        <NavLink icon="fa-bell-o" to="/wedding">
            Wedding Album
        </NavLink>
        <NavLink icon="fa-camera-retro" to="/wedding/photos" indentLevel={1}>
            Photos
        </NavLink>
        <NavLink icon="fa-cube" to="/pll">
            Rubik's Cube
        </NavLink>
        <NavLink icon="fa-rotate-right" to="/pll" indentLevel={1}>
            PLL Algorithms
        </NavLink>
        <NavLink icon='fa-gamepad' to="/pokemon/evhelper">
            EV Helper
        </NavLink>
        {hasAdminKey() && (
            <React.Fragment>
                <NavLink icon="fa-bookmark-o" to="/bookmarks">
                    Bookmarks
                </NavLink>
                <NavLink icon="fa-tachometer" to="/location">
                    Location
                </NavLink>
            </React.Fragment>
        )}
    </div>
);

export default Nav;
