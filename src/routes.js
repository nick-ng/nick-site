import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route as R
} from "react-router-dom";

import './style.css';

import PermuteLastLayerPage from './components/permute-last-layer';
import Wedding from './components/wedding';
import WeddingPhotos from './components/wedding-photos';

export default function App() {
    return (
        <Router>
            <Switch>
                <R path="/weddingphotos"><WeddingPhotos /></R>
                <R path="/wedding"><WeddingPhotos /></R>
                <R path="/pll"><PermuteLastLayerPage /></R>
                <R path="/"><Wedding /></R>
            </Switch>
        </Router>
    );
}
