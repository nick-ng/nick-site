import React from 'react';

import css from './styles.css';

// Check Contentful for image manipulation references
// https://www.contentful.com/developers/docs/references/images-api/#/reference

const thumbnailParams = '?fm=jpg&q=80&fit=fill&w=300&h=300&f=faces';

class WeddingPhotos extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        loaded: false,
        photos: [],
    };
  }

  async componentDidMount() {
      this.setState({
          loaded: false,
      });
    const res = await fetch('/api/wedding_photos');
    const photos = await res.json();
    this.setState({
        loaded: true,
        photos,
    });
  }

  render() {
    const { loaded, photos } = this.state;
    return (<div className={css.container}>
      <h1>Sylvia and Nick</h1>
      <h2>Wedding Photos</h2>
      {loaded
      ? <div className={css.thumbnailGrid}>{photos.map(photo => {
          const url = photo.file.url;
          const description = photo.description;
          return (<a href={url}><img
        key={url}
        src={`${url}${thumbnailParams}`}
        alt={description}
    /></a>)})}</div>
        : <p>Loading...</p>}
    </div>);
  }
}

export default WeddingPhotos;
