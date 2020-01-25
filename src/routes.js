import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route as R
} from "react-router-dom";

import css from './style.css';

import Header from './components/header';
import Nav from './components/navigation';
import PermuteLastLayerPage from './components/permute-last-layer';
import Home from './components/home';
import WeddingPhotos from './components/wedding-photos';
import Admin from './components/admin';

export default function App() {
    return (
        <Router>
            <div className={css.container}>
                <Nav />
                <div className={css.pageContent}>
                    <Header />
                    <Switch>
                        <R path="/weddingphotos"><WeddingPhotos /></R>
                        <R path="/wedding"><WeddingPhotos /></R>
                        <R path="/pll"><PermuteLastLayerPage /></R>
                        <R path="/admin"><Admin /></R>
                        <R path="/"><Home /></R>
                    </Switch>
                </div>
            </div>
        </Router>
    );
}
