import React from 'react';
import { BrowserRouter as Router, Switch, Route as R } from 'react-router-dom';

import css from './styles.css';

import Header from './components/header';
import Nav from './components/nav';
import PermuteLastLayerPage from './components/permute-last-layer';
import Bookmarks from './components/bookmarks';
import Home from './components/home';
import WeddingPhotos from './components/wedding-photos';
import Location from './components/location';
import PokemonFlashCards from './components/pokemon/flash-cards';
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
                        <R path="/bookmarks">
                            <Bookmarks />
                        </R>
                        <R path="/location">
                            <Location />
                        </R>
                        <R path="/pokemon/flashcards">
                            <PokemonFlashCards />
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
