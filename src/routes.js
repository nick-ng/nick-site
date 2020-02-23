import React from 'react';
import { BrowserRouter as Router, Switch, Route as R } from 'react-router-dom';

import css from './styles.css';

import Nav from './components/nav';
import PermuteLastLayerPage from './components/permute-last-layer';
import Bookmarks from './components/bookmarks';
import Home from './components/home';
import WeddingPhotos from './components/wedding-photos';
import Location from './components/location';
import PokemonFlashCards from './components/pokemon/flash-cards';
import PokemonEVHelper from './components/pokemon/ev-helper';
import Test from './components/test';
import Admin from './components/admin';

let playing1157 = false;

const isIt1157 = () => {
    const now = new Date();
    const hour = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    if (hour === 11 && minutes === 56 && seconds > 15) {
        !playing1157 && window.open('https://www.youtube.com/watch?v=ucmwSvy3Vlc', '_blank');
        playing1157 = true;
        return;
    }
    playing1157 = false;
};

setInterval(isIt1157, 1000);

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
                        <R path="/bookmarks">
                            <Bookmarks />
                        </R>
                        <R path="/location">
                            <Location />
                        </R>
                        <R path="/pokemon/evhelper">
                            <PokemonEVHelper />
                        </R>
                        <R path="/pokemon/flashcards">
                            <PokemonFlashCards />
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
