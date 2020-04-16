import React from 'react';

import css from '../styles.css';

const OLL_GFYCATS = {
    1: {
        gfycatId: '',
    },
};

const PermuteLastLayerPage = () => (
    <div className={css.container}>
        <h1>OLLs</h1>
        <p>
            Original videos{' '}
            <a href="https://www.youtube.com/watch?v=47JfJxU7EjM">
                Rubik's Cube: All 57 OLL Algorithms &amp; Finger Tricks
            </a>{' '}
            by <a href="https://www.youtube.com/channel/UCqTVfT9JQqhA6_Hi_h_h97Q">J Perm</a>.
            Generated with <a href="https://gfycat.com/">gfycat</a>
        </p>
        <div className={css.imageContainer}>
            {Object.keys(OLL_GFYCATS)
                .sort()
                .map(pll => {
                    const { gfycatId } = OLL_GFYCATS[pll];
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
