import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const TARGET_HEIGHT = 400;

const Container = styled.div``;

const Photo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  img {
    max-height: ${TARGET_HEIGHT}px;
  }
`;

const PhotoTags = styled.div`
  display: flex;
  flex-direction: row;

  margin-top: 0.5em;
`;

const PhotoTag = styled.div`
  border: 1px solid grey;
  border-radius: 0.5em;
  padding: 0.2em 0.2em 0.2em 0.5em;
  font-size: 0.8em;

  & + & {
    margin-left: 0.5em;
  }

  button {
    margin-left: 0.2em;
    border: none;
    background: none;
  }
`;

const TagControls = styled.div`
  margin-top: 0.5em;
`;

export default function PhotoEditor({ photo, tags, reloadPhotos }) {
  const [selectedTag, setSelectedTag] = useState();

  const imageUrl = photo?.file?.url;
  const originalWidth = photo?.file?.details?.image?.width;
  const originalHeight = photo?.file?.details?.image?.height;
  const ratio = originalWidth / originalHeight;
  const newWidth = Math.floor(ratio * TARGET_HEIGHT);

  if (!imageUrl) {
    return <Container>Please choose a photo.</Container>;
  }

  return (
    <Container>
      <Photo>
        {imageUrl && (
          <img
            src={`${imageUrl}?fm=jpg&q=80&fit=fill&w=${newWidth}&h=${TARGET_HEIGHT}`}
          />
        )}
        <PhotoTags>
          {[...photo.tags]
            .sort((a, b) => a.displayName.localeCompare(b.displayName))
            .map((tag) => (
              <PhotoTag key={`${tag.weddingAlbumTagId}-${tag.uri}`}>
                {tag.displayName}
                <button
                  onClick={async () => {
                    try {
                      await axios.post('/api/wedding_photo/remove-tag', {
                        uri: imageUrl,
                        tagId: tag.weddingAlbumTagId,
                      });
                      reloadPhotos();
                    } catch (e) {
                      console.error(e.response);
                    }
                  }}
                >
                  <i className="fa fa-times" />
                </button>
              </PhotoTag>
            ))}
        </PhotoTags>
      </Photo>
      <TagControls>
        <span>Add a tag:</span>
        <select
          value={selectedTag}
          onChange={(e) => {
            setSelectedTag(e.target.value);
          }}
        >
          <option>Choose a Tag</option>
          {[...tags]
            .sort((a, b) => a.displayName.localeCompare(b.displayName))
            .map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.displayName}
              </option>
            ))}
        </select>
        <button
          onClick={async () => {
            if (selectedTag) {
              try {
                await axios.post('/api/wedding_photo/tag', {
                  uri: imageUrl,
                  tagId: selectedTag,
                });
                reloadPhotos();
              } catch (e) {
                console.error(e);
              }
            }
          }}
        >
          Add
        </button>
      </TagControls>
    </Container>
  );
}
