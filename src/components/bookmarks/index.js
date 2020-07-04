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
            visibleEditors: {},
        };

        this.toggleEditor = this.toggleEditor.bind(this);
        this.addBookmarkHandler = this.addBookmarkHandler.bind(this);
        this.editBookmarkHandler = this.editBookmarkHandler.bind(this);
        this.deleteBookmarkHandler = this.deleteBookmarkHandler.bind(this);
    }

    async componentDidMount() {
        this.getBookmarks();
    }

    async getBookmarks() {
        this.setState({
            bookmarksFetched: false,
            visibleEditors: {},
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

    toggleEditor(id) {
        this.setState(prevState => {
            const { visibleEditors } = prevState;
            return {
                visibleEditors: {
                    ...visibleEditors,
                    [id]: !visibleEditors[id],
                },
            };
        });
    }

    addBookmarkHandler(e) {
        const newBookmark = getFormData(e.target);
        e.target.reset();
        e.preventDefault();

        if (!newBookmark.name) {
            newBookmark.name = newBookmark.url
                .replace(/^https?:\/\//, '')
                .replace(/\/$/, '');
        }

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

    editBookmarkHandler(e, id) {
        const updatedBookmark = getFormData(e.target);
        e.target.reset();
        e.preventDefault();
        this.setState(
            {
                bookmarksFetched: false,
            },
            async () => {
                await axios.put(`api/bookmarks/${id}`, updatedBookmark);
                this.getBookmarks();
            }
        );
    }

    deleteBookmarkHandler(id) {
        this.setState(
            {
                bookmarksFetched: false,
            },
            async () => {
                await axios.delete(`api/bookmarks/${id}`);
                this.getBookmarks();
            }
        );
    }

    render() {
        const { bookmarks, bookmarksFetched, visibleEditors } = this.state;
        return (
            <div className={css.container}>
                <h2>Bookmarks</h2>
                <form
                    className={css.controls}
                    onSubmit={this.addBookmarkHandler}
                >
                    <input type="text" name="url" placeholder="URL" />
                    <input type="text" name="name" placeholder="Name" />
                    <button type="submit">
                        <i className={cx('fa', 'fa-plus')}></i>
                    </button>
                </form>
                <hr />
                {bookmarksFetched ? (
                    <div className={css.bookmarks}>
                        {bookmarks.length > 0 ? (
                            bookmarks.map(({ id, url, name }) => (
                                <div
                                    className={css.bookmarkRow}
                                    key={`bookmark-${id}`}
                                >
                                    <a
                                        className={css.fadeIn}
                                        href={url}
                                        target="_blank"
                                    >
                                        {name}
                                    </a>
                                    <i
                                        className={cx('fa', 'fa-pencil')}
                                        role="button"
                                        onClick={() => this.toggleEditor(id)}
                                    ></i>
                                    {visibleEditors[id] && (
                                        <form
                                            className={css.controls}
                                            onSubmit={e =>
                                                this.editBookmarkHandler(e, id)
                                            }
                                        >
                                            <input
                                                type="text"
                                                name="url"
                                                placeholder="New URL"
                                            />
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="New Name"
                                            />
                                            <button type="submit">
                                                <i
                                                    className={cx(
                                                        'fa',
                                                        'fa-save'
                                                    )}
                                                ></i>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    this.deleteBookmarkHandler(
                                                        id
                                                    )
                                                }
                                            >
                                                <i
                                                    className={cx(
                                                        'fa',
                                                        'fa-trash'
                                                    )}
                                                ></i>
                                            </button>
                                        </form>
                                    )}
                                </div>
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
