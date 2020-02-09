import React from 'react';
import axios from 'axios';

import css from './styles.css';

// Check Contentful for image manipulation references
// https://www.contentful.com/developers/docs/references/images-api/#/reference

const thumbnailParams = '?fm=jpg&q=80&fit=fill&w=500&h=500&f=faces';

export default class WeddingPhotos extends React.Component {
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
        const res = await axios.get('/api/wedding_photos');
        const photos = res.data;
        this.setState({
            loaded: true,
            photos,
        });
    }

    render() {
        const { loaded, photos } = this.state;
        return (
            <div className={css.container}>
                <h2>Wedding Photos</h2>
                {loaded ? (
                    <div className={css.thumbnailGrid}>
                        {photos.map(photo => {
                            const url = photo.file.url;
                            const description = photo.description;
                            return (
                                <a key={`a-${url}`} href={url}>
                                    <img
                                        key={`img-${url}`}
                                        src={`${url}${thumbnailParams}`}
                                        alt={description}
                                    />
                                </a>
                            );
                        })}
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        );
    }
}
