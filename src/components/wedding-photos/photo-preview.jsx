import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);

  display: flex;
  justify-content: center;
  align-items: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0.2em;
  right: 0.5em;

  border: none;
  background: none;
  padding: 0;
  margin: 0;
  color: white;

  font-size: 2em;
`;

const PictureLink = styled.a`
  background: black;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function PhotoPreview(props) {
  const { closeHandler, imageUrl, imageLink, imageWidth, imageHeight } = props;

  const [width, setWidth] = useState(80);
  const [height, setHeight] = useState(80);

  useEffect(() => {
    const scale = 0.8;
    const ratio = imageWidth / imageHeight;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    setWidth(Math.min(ratio * windowHeight * scale, windowWidth * scale));
    setHeight(Math.min((windowWidth / ratio) * scale, windowHeight * scale));
  }, [imageWidth, imageHeight]);

  return (
    <Container
      role="button"
      onClick={() => {
        closeHandler();
      }}
    >
      <CloseButton>
        <i className="fa fa-times" />
      </CloseButton>
      <PictureLink
        href={imageLink}
        target="_blank"
        style={{ width: `${width + 10}px`, height: `${height + 10}px` }}
      >
        <img
          src={imageUrl}
          style={{ width: `${width}px`, height: `${height}px` }}
        />
      </PictureLink>
    </Container>
  );
}
