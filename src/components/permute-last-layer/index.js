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
    na: {
        probability: 1 / 72,
        url: 'BriefDeadFlamingo',
    },
    nb: {
        probability: 1 / 72,
        url: 'SafeBarrenElephant',
    },
    ra: {
        probability: 4 / 72,
        url: 'ImportantOldfashionedAsiandamselfly',
    },
    rb: {
        probability: 4 / 72,
        url: 'TotalEntireFlyingfox',
    },
    ua: {
        probability: 4 / 72,
        url: 'SafeEssentialIaerismetalmark',
        alternatives: [
            'MildMarriedGuppy'
        ]
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
            <div>
                <h1>PLLs</h1>
                <p>Original videos <a href="https://www.youtube.com/watch?v=JvqGU0UZPcE">Fast PLL Algorithms &amp; Finger Tricks</a> and <a href="https://www.youtube.com/watch?v=TWN9LNCHQY8">Alternative PLL Algorithms</a> by <a href="https://www.youtube.com/channel/UCqTVfT9JQqhA6_Hi_h_h97Q">J Perm</a>. Generated with <a href="https://gfycat.com/">gfycat</a></p>
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
            </div>
        )
    }
}
