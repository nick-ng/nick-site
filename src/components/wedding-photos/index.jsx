import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

import Loading from '../loading';
import RequestPermission from './request-permission';
import PhotoPreview from './photo-preview';
import { addTagsToPhotos } from './utils';

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

const ThumbnailGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  justify-content: center;
  grid-gap: 5px 5px;

  img {
    display: block;
    width: 100%;
  }
`;

export default function WeddingPhotos() {
  const [loaded, setLoaded] = useState(false);
  const [haveAccess, setHaveAccess] = useState('maybe');
  const [photos, setPhotos] = useState([]);
  const [showPreview, setShowPreview] = useState(null);

  useEffect(() => {
    const runAsync = async () => {
      setLoaded(false);

      try {
        const res = await axios.get('/api/wedding_photos');

        const newPhotos = addTagsToPhotos(res.data.photos, res.data.photoTags);

        setPhotos(newPhotos);
        setLoaded(true);
        setHaveAccess('yes');
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
      <h2>Wedding Photos</h2>
      {loaded ? (
        <ThumbnailGrid>
          {[...photos]
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((photo) => {
              const url = photo.file.url;
              const width = photo?.file?.details?.image?.width;
              const height = photo?.file?.details?.image?.height;

              const { newWidth, newHeight } = resizePicture(
                width,
                height,
                TARGET_PX
              );

              const description = photo.description;
              return (
                <div
                  role="button"
                  tabIndex={0}
                  key={`thumbnail-${url}`}
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
                </div>
              );
            })}
        </ThumbnailGrid>
      ) : (
        <Loading />
      )}
      {haveAccess === 'no' && <RequestPermission />}
      {showPreview !== null && (
        <PhotoPreview
          closeHandler={() => {
            setShowPreview(null);
          }}
          {...showPreview}
        />
      )}
    </Container>
  );
}