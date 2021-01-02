import React, { useState } from 'react';
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

  video: {
    background-color: grey;
  }
`;

const OLL_VIDEOS = [
  {
    case: 'All Edges Oriented',
    videos: ['21', '22', '23', '24', '25', '26', '27'],
  },
  {
    case: 'All Corners Oriented',
    videos: [],
  },
  {
    case: 'T Shapes',
    videos: [],
  },
  {
    case: 'W Shapes',
    videos: ['36', '38'],
  },
  {
    case: 'Square Shapes',
    videos: ['05', '06'],
  },
  {
    case: 'P Shapes',
    videos: ['31', '32', '43', '44'],
  },
  {
    case: 'Fish Shapes',
    videos: ['09', '10', '35', '37'],
  },
  {
    case: 'C Shapes',
    videos: ['34', '46'],
  },
  {
    case: 'Small Lightning Bolts',
    videos: ['07', '08', '11', '12'],
  },
  {
    case: 'Big Lightning Bolts',
    videos: ['39', '40'],
  },
  {
    case: 'Small L Shapes',
    videos: ['47', '48', '49', '50', '53', '54'],
  },
  {
    case: 'Knight Move Shapes (Big L)',
    videos: ['13', '14', '15', '16'],
  },
  {
    case: 'I Shapes',
    videos: ['51', '52', '55', '56'],
  },
  {
    case: 'Awkward Shapes (Glider)',
    videos: ['29', '30', '41', '42'],
  },
  {
    case: 'No Edges Oriented',
    videos: ['01', '02', '03', '04', '17', '18', '19', '20'],
  },
].filter((ollSet) => ollSet.videos.length > 0);

const OrientLastLayerPage = () => {
  const [expandedCase, setExpandedCase] = useState(null);

  return (
    <Container>
      <h1>OLLs</h1>
      <p>
        Original videos{' '}
        <a href="https://www.youtube.com/watch?v=47JfJxU7EjM">
          Rubik's Cube: All 57 OLL Algorithms &amp; Finger Tricks
        </a>{' '}
        by{' '}
        <a href="https://www.youtube.com/channel/UCqTVfT9JQqhA6_Hi_h_h97Q">
          J Perm
        </a>
        .
      </p>
      <OllSets>
        {OLL_VIDEOS.map((ollSet) => (
          <OllSet key={ollSet.case}>
            <h3>
              {ollSet.case} ({ollSet.videos.length} cases)
              <button
                onClick={() => {
                  setExpandedCase(ollSet.case);
                }}
              >
                Expand
              </button>
            </h3>
            {expandedCase === ollSet.case && (
              <OllVideos>
                {ollSet.videos.map((videoNumber) => (
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
            )}
          </OllSet>
        ))}
      </OllSets>
    </Container>
  );
};

export default OrientLastLayerPage;
