import React from 'react';
import styled from 'styled-components';

const TARGET_HEIGHT = 400;

const Container = styled.div``;

const Photo = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;

  img {
    max-height: ${TARGET_HEIGHT}px;
  }
`;

export default function PhotoEditor({ photo }) {
  const imageUrl = photo?.file?.url;
  const originalWidth = photo?.file?.details?.image?.width;
  const originalHeight = photo?.file?.details?.image?.height;
  const ratio = originalWidth / originalHeight;
  const newWidth = Math.floor(ratio * TARGET_HEIGHT);

  return (
    <Container>
      <Photo>
        {imageUrl && (
          <img
            src={`${imageUrl}?fm=jpg&q=80&fit=fill&w=${newWidth}&h=${TARGET_HEIGHT}`}
          />
        )}
      </Photo>
    </Container>
  );
}
