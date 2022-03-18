import React from 'react';
import styled from 'styled-components';
import moment from 'moment';

import Header from '../header';
import NavLink, { AdminNav } from './nav-link';

import css from './styles.css';

const DayMod3 = styled.div`
  position: absolute;
  bottom: 0px;
  left: 0px;
  padding: 10px;
  min-width: 100px;
  color: transparent;
  cursor: default;

  &:hover {
    color: black;
  }
`;

const DayDisplay = styled.span`
  font-size: 1em;
  margin-bottom: 0.3em;
`;

export default function Nav() {
  return (
    <div className={css.navContainer}>
      <Header />
      <DayDisplay>{moment().format('dddd')}</DayDisplay>
      <NavLink icons="fa-home" to="/" exact>
        Home
      </NavLink>
      <AdminNav
        icons={['fa-file-text-o', 'fa-pencil']}
        to="/markdown-editor"
        indentLevel={1}
      >
        .md Editor
      </AdminNav>
      <AdminNav
        icons={['fa-file-text-o', 'fa-star-half-o']}
        to="/notes"
        indentLevel={1}
      >
        Notes
      </AdminNav>
      <AdminNav otherKeys={['weddingAlbumKey']} icons="fa-bell-o" to="/wedding">
        Wedding Album
      </AdminNav>
      <AdminNav icons="fa-camera-retro" to="/wedding/photos" indentLevel={1}>
        Photos
      </AdminNav>
      <AdminNav icons="" to="/wedding-permission">
        Wedding Permissions
      </AdminNav>
      <AdminNav icons="fa-bookmark-o" to="/bookmarks">
        Bookmarks
      </AdminNav>
      <AdminNav icons="fa-clock-o" to="/countdowns">
        Countdowns
      </AdminNav>
      <NavLink icons={['fa-check-square-o', 'fa-square-o']} to="/dione">
        Todos
      </NavLink>
      <NavLink icons="fa-cube" to="/cubetimer">
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
      <NavLink icons={['fa-cube', 'fa-rotate-right']} to="/pll" indentLevel={1}>
        PLL Algorithms
      </NavLink>
      <NavLink icons={['fa-cube', 'fa-rotate-left']} to="/oll" indentLevel={1}>
        OLL Algorithms
      </NavLink>
      <NavLink icons={['fa-square-o', 'fa-mouse-pointer']} to="/boxclicker">
        Box Clicker
      </NavLink>
      <NavLink
        icons={['fa-square-o', 'fa-mouse-pointer', 'fa-video-camera']}
        to="/boxclicker/replay"
        indentLevel={1}
      >
        Replay Player
      </NavLink>
      <NavLink icons={['fa-keyboard-o']} to="/alphabet">
        Type The Alphabet
      </NavLink>
      <NavLink icons={['fa-calculator -o']} to="/numbertyper">
        Number Typer
      </NavLink>
      <NavLink icons={['fa-smile-o']} to="/confetti-maker">
        Confetti Maker
      </NavLink>
      <NavLink icons={['fa-volume-up']} to="/texttospeech">
        Text to Speech
      </NavLink>
      <NavLink icons={['fa-clock-o']} to="/timers">
        Timers
      </NavLink>
      <AdminNav icons="fa-tachometer" to="/location">
        Location
      </AdminNav>
      <NavLink icons={['fa-ellipsis-h']} to="/misc">
        Misc.
      </NavLink>
      <DayMod3>
        {moment().diff(moment([2020, 11, 31]), 'days') % 3} (
        {moment().diff(moment([2020, 11, 31]), 'days')})
      </DayMod3>
    </div>
  );
}
