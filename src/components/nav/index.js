import React from 'react';

import Header from '../header';
import NavLink, { AdminNav } from './nav-link';

import css from './styles.css';

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
        <AdminNav icon="fa-bookmark-o" to="/bookmarks">
            Bookmarks
        </AdminNav>
        <AdminNav icon="fa-clock-o" to="/countdowns">
            Countdowns
        </AdminNav>
        <NavLink icon="fa-gamepad" to="/pokemon/flashcards">
            Flash Cards
        </NavLink>
        <NavLink icon="fa-gamepad" to="/pokemon/evhelper">
            EV Helper
        </NavLink>
        <NavLink icon="fa-pencil" to="/dnd/druidspellbook">
            Druid Spells
        </NavLink>
        <NavLink icon="fa-pencil" to="/dnd/paladinspellbook">
            Paladin Spells
        </NavLink>
        <AdminNav icon="fa-pencil" to="/dnd/wizardspellbook">
            Wizard Spells
        </AdminNav>
        <NavLink icon="fa-cube" to="/pll">
            Rubik's Cube
        </NavLink>
        <NavLink icon="fa-rotate-right" to="/pll" indentLevel={1}>
            PLL Algorithms
        </NavLink>
        <NavLink icon="fa-rotate-right" to="/oll" indentLevel={1}>
            OLL Algorithms
        </NavLink>
        <AdminNav icon="fa-tachometer" to="/location">
            Location
        </AdminNav>
    </div>
);

export default Nav;
