import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import styled from 'styled-components';

import Loading from '../loading';
import RequestPermission from './request-permission';
import PhotoThumbnail from './photo-thumbnail';
import PhotoPreview from './photo-preview';
import TagControls from './tag-controls';
import { addTagsToPhotos, getUniqueTags, makeTagFilter } from './utils';

const TARGET_PX = 1280 * 720;

// Check Contentful for image manipulation references
// https://www.contentful.com/developers/docs/references/images-api/#/reference

const thumbnailParams = '?fm=jpg&q=75&fit=fill&w=300&h=300&f=faces';
const viewParams = '?fm=jpg&q=80';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
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
  const [selectedTags, setSelectedTags] = useState([]);

  const uniqueTags = useMemo(() => getUniqueTags(photos), [photos]);

  const tagFilter = makeTagFilter(selectedTags);

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
      <TagControls
        allTags={uniqueTags}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
      />
      {loaded ? (
        <>
          {selectedTags.length > 0 && (
            <>
              <ThumbnailGrid>
                {[...photos]
                  .filter(tagFilter)
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((photo) => (
                    <PhotoThumbnail
                      photo={photo}
                      targetPX={TARGET_PX}
                      thumbnailParams={thumbnailParams}
                      viewParams={viewParams}
                      setShowPreview={setShowPreview}
                      key={`thumbnail-${photo.file.url}`}
                    />
                  ))}
              </ThumbnailGrid>
              <hr style={{ width: '100%' }} />
            </>
          )}
          <ThumbnailGrid>
            {[...photos]
              .filter((photo) => !tagFilter(photo))
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((photo) => (
                <PhotoThumbnail
                  photo={photo}
                  targetPX={TARGET_PX}
                  thumbnailParams={thumbnailParams}
                  viewParams={viewParams}
                  setShowPreview={setShowPreview}
                  key={`thumbnail-${photo.file.url}`}
                />
              ))}
          </ThumbnailGrid>
        </>
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
