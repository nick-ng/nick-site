import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

import Loading from '../../loading';
import PhotoEditor from './photo-editor';
import TagEditor from './tag-editor';
import { addTagsToPhotos } from '../utils';

// Check Contentful for image manipulation references
// https://www.contentful.com/developers/docs/references/images-api/#/reference

const thumbnailParams = '?fm=jpg&q=75&fit=fill&w=300&h=300&f=faces';

const reloadPhotos = async (setPhotos, setPhotoTags) => {
  const photoRes = await axios.get('/api/wedding_photos');

  const newPhotos = addTagsToPhotos(
    photoRes.data.photos,
    photoRes.data.photoTags
  );

  setPhotos(newPhotos);
  setPhotoTags(photoRes.data.photoTags);
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
  grid-gap: 1em;
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
  const [photos, setPhotos] = useState([]);
  const [photoTags, setPhotoTags] = useState([]);
  const [selectedPhotoUri, setSelectedPhotoUri] = useState(null);
  const [tags, setTags] = useState([]);
  const [reverseSort, setReverseSort] = useState(1);

  const selectedPhoto = photos.filter(
    (photo) => photo.file.url === selectedPhotoUri
  )[0];

  useEffect(() => {
    const runAsync = async () => {
      setLoaded(false);

      try {
        const [_, tagRes] = await Promise.all([
          reloadPhotos(setPhotos, setPhotoTags),
          axios.get('/api/wedding_album_tags'),
        ]);

        setLoaded(true);
        setTags(tagRes.data);
      } catch (e) {
        setLoaded(true);

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
          <label>
            Reverse Sort:&nbsp;
            <input
              type="checkbox"
              onChange={() => {
                setReverseSort((prev) => prev * -1);
              }}
              checked={reverseSort < 0}
            />
          </label>
          <PhotoEditor
            photo={selectedPhoto}
            photoTags={photoTags}
            tags={tags}
            reloadPhotos={() => {
              reloadPhotos(setPhotos, setPhotoTags);
            }}
          />
          <TagEditor tags={tags} setTags={setTags} />
        </Controls>
        {loaded ? (
          <ThumbnailGrid>
            {[...photos]
              .sort((a, b) => (a.sortOrder - b.sortOrder) * reverseSort)
              .map((photo) => {
                const url = photo.file.url;

                const description = photo.description;
                return (
                  <ThumbnailGridItem
                    role="button"
                    tabIndex={0}
                    selected={url === selectedPhotoUri}
                    key={`thumbnail-${url}`}
                    onClick={() => {
                      setSelectedPhotoUri(url);
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
