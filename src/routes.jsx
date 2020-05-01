import React from 'react';
import { BrowserRouter as Router, Switch, Route as R } from 'react-router-dom';

import css from './styles.css';

import Nav from './components/nav';
import OrientLastLayer from './components/rubiks-cube/orient-last-layer';
import PermuteLastLayerPage from './components/rubiks-cube/permute-last-layer';
import CubeTimer from './components/rubiks-cube/timer';
import Bookmarks from './components/bookmarks';
import Countdowns from './components/countdowns';
import Home from './components/home';
import WeddingPhotos from './components/wedding-photos';
import Location from './components/location';
import PokemonFlashCards from './components/pokemon/flash-cards';
// import PokemonEVHelper from './components/pokemon/ev-helper';
import PokemonNotes from './components/pokemon/notes';
import DnDSpellBook from './components/dungeons-and-dragons/spell-book';
import Test from './components/test';
import Admin from './components/admin';

export default function App() {
    return (
        <Router>
            <div className={css.container}>
                <Nav />
                <div className={css.pageContent}>
                    <Switch>
                        <R path="/weddingphotos">
                            <WeddingPhotos />
                        </R>
                        <R path="/wedding">
                            <WeddingPhotos />
                        </R>
                        <R path="/pll">
                            <PermuteLastLayerPage />
                        </R>
                        <R path="/oll">
                            <OrientLastLayer />
                        </R>
                        <R path="/cubetimer">
                            <CubeTimer />
                        </R>
                        <R path="/bookmarks">
                            <Bookmarks />
                        </R>
                        <R path="/countdowns">
                            <Countdowns />
                        </R>
                        <R path="/location">
                            <Location />
                        </R>
                        {/* <R path="/pokemon/evhelper">
                            <PokemonEVHelper />
                        </R> */}
                        <R path="/pokemon/flashcards">
                            <PokemonFlashCards />
                        </R>
                        <R path="/pokemon/notes">
                            <PokemonNotes />
                        </R>
                        <R path="/dnd/druidspellbook">
                            <DnDSpellBook casterClass="druid" key="druid" />
                        </R>
                        <R path="/dnd/paladinspellbook">
                            <DnDSpellBook casterClass="paladin" key="paladin" />
                        </R>
                        <R path="/dnd/wizardspellbook">
                            <DnDSpellBook casterClass="wizard" key="wizard" />
                        </R>
                        <R path="/test">
                            <Test />
                        </R>
                        <R path="/admin">
                            <Admin />
                        </R>
                        <R path="/">
                            <Home />
                        </R>
                    </Switch>
                </div>
            </div>
        </Router>
    );
}
