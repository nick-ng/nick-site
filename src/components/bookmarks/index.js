import React from 'react';
import axios from 'axios';
import cx from 'classnames';

import Loading from '../loading';
import { getFormData } from '../../utils/dom';

import css from './styles.css';

export default class Admin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            bookmarks: [],
            bookmarksFetched: false,
        };

        this.addBookmark = this.addBookmark.bind(this);
    }

    async componentDidMount() {
        this.getBookmarks();
    }

    async getBookmarks() {
        this.setState({
            bookmarksFetched: false,
        });
        const res = await axios.get('api/bookmarks');
        const bookmarks = res.data.bookmarks.sort((a, b) =>
            a.name.localeCompare(b.name)
        );
        this.setState({
            bookmarks,
            bookmarksFetched: true,
        });
    }

    addBookmark(e) {
        const newBookmark = getFormData(e.target);
        e.target.reset();
        e.preventDefault();
        this.setState(
            {
                bookmarksFetched: false,
            },
            async () => {
                await axios.post('api/bookmarks', newBookmark);
                this.getBookmarks();
            }
        );
    }

    render() {
        const { bookmarks, bookmarksFetched } = this.state;
        return (
            <div className={css.container}>
                <h2>Bookmarks</h2>
                <form className={css.controls} onSubmit={this.addBookmark}>
                    <input type="text" name="url" placeholder="URL" />
                    <input type="text" name="name" placeholder="Name" />
                    <button type="submit">
                        <i className={cx('fa', 'fa-plus')}></i>
                    </button>
                </form>
                {bookmarksFetched ? (
                    <div>
                        {bookmarks.length > 0 ? (
                            bookmarks.map(({ id, uri, name }) => (
                                <a
                                    className={css.fadeIn}
                                    key={`bookmark-${id}`}
                                    href={uri}
                                >
                                    {name}
                                </a>
                            ))
                        ) : (
                            <div className={css.fadeIn}>Nothing here!</div>
                        )}
                    </div>
                ) : (
                    <Loading />
                )}
            </div>
        );
    }
}
