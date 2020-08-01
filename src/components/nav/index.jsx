import React from 'react';

import Header from '../header';
import NavLink, { AdminNav } from './nav-link';

import css from './styles.css';

const Nav = () => (
    <div className={css.navContainer}>
        <Header />
        <NavLink icons="fa-home" to="/" exact>
            Home
        </NavLink>
        <AdminNav icons="fa-bell-o" to="/wedding">
            Wedding Album
        </AdminNav>
        <AdminNav icons="fa-camera-retro" to="/wedding/photos" indentLevel={1}>
            Photos
        </AdminNav>
        <AdminNav icons="fa-bookmark-o" to="/bookmarks">
            Bookmarks
        </AdminNav>
        <AdminNav icons="fa-clock-o" to="/countdowns">
            Countdowns
        </AdminNav>
        <NavLink icons={['fa-check-square-o', 'fa-square-o']} to="/dione">
            Dione: Todos
        </NavLink>
        <NavLink icons="fa-gamepad" to="/pokemon/flashcards">
            Flash Cards
        </NavLink>
        {/* <NavLink icons="fa-gamepad" to="/pokemon/evhelper">
            EV Helper
        </NavLink> */}
        <NavLink
            icons={['fa-gamepad', 'fa-shopping-cart']}
            to="/pokemon/cramomatic"
        >
            Cram-o-matic Helper
        </NavLink>
        <NavLink icons="fa-gamepad" to="/pokemon/notes">
            Pokemon Notes
        </NavLink>
        <NavLink icons="fa-pencil" to="/dnd/druidspellbook">
            Druid Spells
        </NavLink>
        <NavLink icons="fa-pencil" to="/dnd/paladinspellbook">
            Paladin Spells
        </NavLink>
        <AdminNav icons="fa-pencil" to="/dnd/wizardspellbook">
            Wizard Spells
        </AdminNav>
        <NavLink icons="fa-cube" to="/pll">
            Rubik's Cube
        </NavLink>
        <NavLink
            icons={['fa-cube', 'fa-clock-o']}
            to="/cubetimer"
            indentLevel={1}
        >
            Cube Timer
        </NavLink>
        <NavLink
            icons={['fa-cube', 'fa-line-chart']}
            to="/sessiondetails"
            indentLevel={1}
        >
            Session Details
        </NavLink>
        <NavLink
            icons={['fa-cube', 'fa-list-ul']}
            to="/cubesessionmanager"
            indentLevel={1}
        >
            Session Manager
        </NavLink>
        <NavLink
            icons={['fa-cube', 'fa-rotate-right']}
            to="/pll"
            indentLevel={1}
        >
            PLL Algorithms
        </NavLink>
        <NavLink
            icons={['fa-cube', 'fa-rotate-left']}
            to="/oll"
            indentLevel={1}
        >
            OLL Algorithms
        </NavLink>
        <NavLink icons={['fa-square-o', 'fa-mouse-pointer']} to="/boxclicker">
            Box Clicker
        </NavLink>
        <AdminNav icons="fa-tachometer" to="/location">
            Location
        </AdminNav>
    </div>
);

export default Nav;
