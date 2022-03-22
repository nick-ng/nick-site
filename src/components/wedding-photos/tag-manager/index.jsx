import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

import Loading from '../../loading';
import PhotoEditor from './photo-editor';
import TagEditor from './tag-editor';

const TARGET_PX = 1280 * 720;

// Check Contentful for image manipulation references
// https://www.contentful.com/developers/docs/references/images-api/#/reference

const thumbnailParams = '?fm=jpg&q=75&fit=fill&w=300&h=300&f=faces';
const viewParams = '?fm=jpg&q=80';

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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TwoColumns = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 5px;
`;

const Controls = styled.div`
  display: flex;
  flex-direction: column;
`;

const ThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  justify-content: center;
  grid-gap: 5px 5px;
`;

const ThumbnailGridItem = styled.div`
  ${(props) => (props.selected ? 'border: 3px solid green;' : '')}

  img {
    display: block;
    width: 100%;
  }
`;

export default function WeddingTagManager() {
  const [loaded, setLoaded] = useState(false);
  const [haveAccess, setHaveAccess] = useState('maybe');
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const runAsync = async () => {
      setLoaded(false);

      try {
        const [photoRes, tagRes] = await Promise.all([
          axios.get('/api/wedding_photos'),
          axios.get('/api/wedding_album_tags'),
        ]);

        setPhotos(photoRes.data.photos);
        setLoaded(true);
        setHaveAccess('yes');
        setTags(tagRes.data);
      } catch (e) {
        setLoaded(true);
        setHaveAccess('no');

        if (e.response.status === 401 && localStorage.getItem('adminKey')) {
          localStorage.removeItem('adminKey');
          window.location.href = window.location.href.split('?')[0];
        }
      }
    };

    runAsync();
  }, []);

  return (
    <Container>
      <h2>Wedding Photo Tag Manager</h2>
      <TwoColumns>
        <Controls>
          <PhotoEditor photo={selectedPhoto} />
          <TagEditor tags={tags} setTags={setTags} />
        </Controls>
        {loaded ? (
          <ThumbnailGrid>
            {photos.map((photo) => {
              const url = photo.file.url;
              const width = photo?.file?.details?.image?.width;
              const height = photo?.file?.details?.image?.height;

              const description = photo.description;
              return (
                <ThumbnailGridItem
                  role="button"
                  tabIndex={0}
                  selected={url === selectedPhoto?.file?.url}
                  key={`thumbnail-${url}`}
                  onClick={() => {
                    setSelectedPhoto(photo);
                  }}
                >
                  <img
                    loading="lazy"
                    style={{ minHeight: '200px' }}
                    src={`https:${url}${thumbnailParams}`}
                    alt={description}
                  />
                </ThumbnailGridItem>
              );
            })}
          </ThumbnailGrid>
        ) : (
          <Loading />
        )}
      </TwoColumns>
    </Container>
  );
}
