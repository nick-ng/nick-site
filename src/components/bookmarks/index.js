import React from 'react';
import axios from 'axios';

import css from './styles.css';

export default class Admin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            bookmarks: [],
        };
    }

    async componentDidMount() {
        this.getBookmarks();
    }

    async getBookmarks() {
        const res = await axios('api/bookmarks');
        console.log('res', res);
        this.setState({
            bookmarks: [1, 2, 3],
        });
    }

    render() {
        const { bookmarks } = this.state;
        return (
            <div className={css.container}>
                <h2>Bookmarks</h2>
                <div>
                    {bookmarks.map(bookmark => (
                        <div key={bookmark}>{bookmark}</div>
                    ))}
                </div>
            </div>
        );
    }
}
