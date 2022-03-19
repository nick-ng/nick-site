import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const TARGET_PX = 920000;

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
  const [pixelsW, setPixelsW] = useState(90);
  const [pixelsH, setPixelsH] = useState(90);

  useEffect(() => {
    const scale = 0.8;
    const ratio = imageWidth / imageHeight;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const newWidth = Math.min(
      ratio * windowHeight * scale,
      windowWidth * scale
    );
    const newHeight = Math.min(
      (windowWidth / ratio) * scale,
      windowHeight * scale
    );

    setWidth(Math.floor(newWidth));
    setHeight(Math.floor(newHeight));

    const pixels = newWidth * newHeight;
    const ratioB = Math.sqrt(TARGET_PX / pixels);

    if (ratioB > 1) {
      setPixelsW(Math.floor(newWidth * ratioB));
      setPixelsH(Math.floor(newHeight * ratioB));
    } else {
      setPixelsW(Math.floor(newWidth));
      setPixelsH(Math.floor(newHeight));
    }
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
          src={`${imageUrl}?fm=jpg&q=85&fit=fill&w=${pixelsW}&h=${pixelsH}`}
          style={{ width: `${width}px`, height: `${height}px` }}
        />
      </PictureLink>
    </Container>
  );
}
