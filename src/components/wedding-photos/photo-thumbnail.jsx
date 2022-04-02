import React from 'react';
import styled from 'styled-components';

const resizePicture = (width, height, totalPixels) => {
  const ratio = width / height;
  const temp = Math.sqrt(totalPixels * ratio);

  const newWidth = Math.floor(temp);
  const newHeight = Math.floor(temp / ratio);

  return {
    newWidth,
    newHeight,
  };
};

const Container = styled.div``;

export default function PhotoThumbnail({
  photo,
  targetPX,
  thumbnailParams,
  viewParams,
  setShowPreview,
}) {
  const url = photo.file.url;
  const width = photo?.file?.details?.image?.width;
  const height = photo?.file?.details?.image?.height;

  const { newWidth, newHeight } = resizePicture(width, height, targetPX);

  const description = photo.description;
  return (
    <Container
      role="button"
      tabIndex={0}
      onClick={() => {
        setShowPreview({
          imageUrl: url,
          imageLink: `${url}${viewParams}`,
          imageWidth: newWidth,
          imageHeight: newHeight,
        });
      }}
    >
      <img
        loading="lazy"
        style={{ minHeight: '200px' }}
        src={`https:${url}${thumbnailParams}`}
        alt={description}
      />
    </Container>
  );
}
