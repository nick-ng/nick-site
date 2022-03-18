import React from 'react';
import axios from 'axios';

import Loading from '../loading';
import RequestPermission from './request-permission';

import css from './styles.css';

// Check Contentful for image manipulation references
// https://www.contentful.com/developers/docs/references/images-api/#/reference

const thumbnailParams = '?fm=jpg&q=80&fit=fill&w=500&h=500&f=faces';
const viewParams = '?fm=jpg&q=75';

export default class WeddingPhotos extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      haveAccess: 'maybe',
      photos: [],
    };
  }

  async componentDidMount() {
    this.setState({
      loaded: false,
    });
    try {
      const res = await axios.get('/api/wedding_photos');

      const photos = res.data;
      this.setState({
        loaded: true,
        haveAccess: 'yes',
        photos,
      });
    } catch (e) {
      this.setState({
        loaded: true,
        haveAccess: 'no',
      });
      if (localStorage.getItem('adminKey')) {
        localStorage.removeItem('adminKey');
        window.location.href = window.location.href.split('?')[0];
      }
    }
  }

  render() {
    const { loaded, haveAccess, photos } = this.state;
    return (
      <div className={css.container}>
        <h2>Wedding Photos</h2>
        {loaded ? (
          <div className={css.thumbnailGrid}>
            {photos.map((photo) => {
              const url = photo.file.url;
              const description = photo.description;
              return (
                <a key={`a-${url}`} href={`https:${url}${viewParams}`}>
                  <img
                    key={`img-${url}`}
                    src={`https:${url}${thumbnailParams}`}
                    alt={description}
                  />
                </a>
              );
            })}
          </div>
        ) : (
          <Loading />
        )}
        {haveAccess === 'no' && <RequestPermission />}
      </div>
    );
  }
}
