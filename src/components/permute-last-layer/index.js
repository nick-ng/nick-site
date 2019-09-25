import React, { Component } from 'react';

import css from './styles.css';

const PLL_GFYCATS = {
    f: {
        probability: 4 / 72,
        url: 'MarvelousWelllitEthiopianwolf'
    },
    ga: {
        probability: 4 / 72,
        url: 'VapidSilkyAtlanticblackgoby'
    },
    gb: {
        probability: 4 / 72,
        url: 'IdleHollowCusimanse'
    },
    gc: {
        probability: 4 / 72,
        url: 'SomeEsteemedKinglet'
    },
    gd: {
        probability: 4 / 72,
        url: 'UnkemptForthrightChital'
    },
    ja: {
        probability: 4 / 72,
        url: 'CrazyCheerfulAyeaye'
    },
    ua: {
        probability: 4 / 72,
        url: 'MildMarriedGuppy'
    },
    ub: {
        probability: 4 / 72,
        url: 'MediocreAffectionateGnatcatcher'
    },
    v: {
        probability: 4 / 72,
        url: 'FrightenedUniformHagfish'
    },
    y: {
        probability: 4 / 72,
        url: 'ShimmeringPleasingBabirusa'
    },
};

export default class PermuteLastLayerPage extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className={css.container}>
                {Object.keys(PLL_GFYCATS).sort().map(pll => {
                    const {
                        url,
                    } = PLL_GFYCATS[pll];
                    return (<img
                        src={`https://thumbs.gfycat.com/${url}.webp`}
                        className={css.picture}
                    />);
                })}
            </div>
        )
    }
}
