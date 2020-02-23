import React from 'react';

import css from './styles.css';

const PLL_GFYCATS = {
    f: {
        probability: 4 / 72,
        gfycatId: 'MarvelousWelllitEthiopianwolf',
    },
    ga: {
        probability: 4 / 72,
        gfycatId: 'VapidSilkyAtlanticblackgoby',
    },
    gb: {
        probability: 4 / 72,
        gfycatId: 'IdleHollowCusimanse',
    },
    gc: {
        probability: 4 / 72,
        gfycatId: 'SomeEsteemedKinglet',
    },
    gd: {
        probability: 4 / 72,
        gfycatId: 'UnkemptForthrightChital',
    },
    ja: {
        probability: 4 / 72,
        gfycatId: 'CrazyCheerfulAyeaye',
    },
    na: {
        probability: 1 / 72,
        gfycatId: 'BriefDeadFlamingo',
    },
    nb: {
        probability: 1 / 72,
        gfycatId: 'SafeBarrenElephant',
    },
    ra: {
        probability: 4 / 72,
        gfycatId: 'ImportantOldfashionedAsiandamselfly',
    },
    rb: {
        probability: 4 / 72,
        gfycatId: 'TotalEntireFlyingfox',
    },
    ua: {
        probability: 4 / 72,
        gfycatId: 'SafeEssentialIaerismetalmark',
        alternatives: ['MildMarriedGuppy'],
    },
    ub: {
        probability: 4 / 72,
        gfycatId: 'MediocreAffectionateGnatcatcher',
    },
    v: {
        probability: 4 / 72,
        gfycatId: 'FrightenedUniformHagfish',
    },
    y: {
        probability: 4 / 72,
        gfycatId: 'ShimmeringPleasingBabirusa',
    },
};

const PermuteLastLayerPage = () => (
    <div className={css.container}>
        <h1>PLLs</h1>
        <p>
            Original videos{' '}
            <a href="https://www.youtube.com/watch?v=JvqGU0UZPcE">
                Fast PLL Algorithms &amp; Finger Tricks
            </a>{' '}
            and <a href="https://www.youtube.com/watch?v=TWN9LNCHQY8">Alternative PLL Algorithms</a>{' '}
            by <a href="https://www.youtube.com/channel/UCqTVfT9JQqhA6_Hi_h_h97Q">J Perm</a>.
            Generated with <a href="https://gfycat.com/">gfycat</a>
        </p>
        <div className={css.imageContainer}>
            {Object.keys(PLL_GFYCATS)
                .sort()
                .map(pll => {
                    const { gfycatId } = PLL_GFYCATS[pll];
                    return (
                        <img
                            key={`img-${gfycatId}`}
                            src={`https://thumbs.gfycat.com/${gfycatId}.webp`}
                            className={css.picture}
                        />
                    );
                })}
        </div>
    </div>
);

export default PermuteLastLayerPage;
