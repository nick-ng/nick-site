import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import debounce from 'lodash/debounce';

const Container = styled.div`
  display: column;
`;

const StreamArea = styled.div`
  iframe {
    box-sizing: border-box;
  }
`;

export default function MultiTwitch() {
  const [channelNames, setChannelNames] = useState([]);
  const [containerWidth, setContainerWidth] = useState(500);
  const containerRef = useRef(null);

  console.log(containerRef.current?.offsetWidth);

  const debounceSetChannelNames = useRef(
    debounce(
      (newNames) => {
        setChannelNames(newNames);
      },
      2000,
      {
        leading: false,
        trailing: true,
      }
    )
  ).current;

  const debounceSetWidth = useRef(
    debounce(() => {
      setContainerWidth(containerRef.current?.offsetWidth || 500);
    }, 200)
  ).current;

  useEffect(() => {
    debounceSetWidth();
  }, [channelNames.length, containerRef.current]);

  useEffect(() => {
    window.addEventListener('resize', debounceSetWidth);

    return () => {
      window.removeEventListener('resize', debounceSetWidth);
    };
  }, [containerRef.current]);

  const streamWidth = containerWidth / Math.min(2, channelNames.length);
  const streamHeight = (streamWidth / 16) * 9;

  return (
    <Container ref={containerRef}>
      <input
        onChange={(e) => {
          debounceSetChannelNames(e.target.value.split(' '));
        }}
      />
      <StreamArea>
        {channelNames.map((channelName) => (
          <iframe
            key={`twitch-${channelName}`}
            src={`https://player.twitch.tv/?channel=${channelName}&parent=${window.location.hostname}`}
            height={streamHeight}
            width={streamWidth}
          />
        ))}
      </StreamArea>
    </Container>
  );
}
