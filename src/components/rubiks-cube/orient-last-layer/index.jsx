import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const OllSets = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const OllSet = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const OllVideos = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
`;

const OLL_VIDEOS = [
    {
        case: 'All Edges Oriented',
        videos: ['21', '22', '23', '24', '25', '26', '27'],
    },
    // {
    //     case: 'All Corners Oriented',
    //     videos: [],
    // },
    {
        case: 'Square Shapes',
        videos: ['05', '06'],
    },
    {
        case: 'P Shapes',
        videos: ['31', '32', '43', '44'],
    },
];

const PermuteLastLayerPage = () => (
    <Container>
        <h1>OLLs</h1>
        <p>
            Original videos{' '}
            <a href="https://www.youtube.com/watch?v=47JfJxU7EjM">
                Rubik's Cube: All 57 OLL Algorithms &amp; Finger Tricks
            </a>{' '}
            by <a href="https://www.youtube.com/channel/UCqTVfT9JQqhA6_Hi_h_h97Q">J Perm</a>.
        </p>
        <OllSets>
            {OLL_VIDEOS.map(ollSet => (
                <OllSet key={ollSet.case}>
                    <h3>{ollSet.case}</h3>
                    <OllVideos>
                        {ollSet.videos.map(videoNumber => (
                            <video
                                key={`${ollSet.case}-${videoNumber}`}
                                loop
                                autoPlay
                                muted
                                width={400}
                                src={`/oll/${videoNumber}.mp4`}
                            />
                        ))}
                    </OllVideos>
                </OllSet>
            ))}
        </OllSets>
    </Container>
);

export default PermuteLastLayerPage;
