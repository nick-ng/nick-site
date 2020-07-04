import React from 'react';
import axios from 'axios';

import {
    listItems,
    getItem,
    setItem,
    removeItem,
} from '../../services/foreignStorage';
import css from './styles.css';

export default class Admin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            adminKey: '',
        };

        this.adminKeyChangeHandler = this.adminKeyChangeHandler.bind(this);
    }

    async componentDidMount() {
        this.setState({
            adminKey: localStorage.getItem('adminKey') || '',
        });
    }

    adminKeyChangeHandler(event) {
        const adminKey = event.target.value;
        this.setState({
            adminKey,
        });
        localStorage.setItem('adminKey', adminKey);
    }

    render() {
        const { adminKey } = this.state;
        return (
            <div className={css.container}>
                <h2>Admin Panel</h2>
                <label>
                    Admin Key:
                    <input
                        value={adminKey}
                        type="password"
                        onChange={this.adminKeyChangeHandler}
                    />
                </label>
                <div>
                    Test:
                    <button
                        onClick={async () => {
                            const a = await axios.get('/api/foreign-storage');
                            console.log('List', a.data);
                        }}
                    >
                        List
                    </button>
                    <button
                        onClick={async () => {
                            const a = await listItems();
                            console.log('List 2', a);
                        }}
                    >
                        List 2
                    </button>
                </div>
                <div>
                    Test:
                    <button
                        onClick={async () => {
                            const a = await axios.get(
                                '/api/foreign-storage/test'
                            );
                            console.log('Get', a.data);
                        }}
                    >
                        Get
                    </button>
                    <button
                        onClick={async () => {
                            const a = await getItem('test');
                            console.log('Get', a);
                        }}
                    >
                        Get 2
                    </button>
                </div>
                <div>
                    Test:
                    <button
                        onClick={async () => {
                            const a = await axios.put(
                                '/api/foreign-storage/test',
                                {
                                    value: JSON.stringify({
                                        hello: 'world',
                                    }),
                                }
                            );
                            console.log('Put', a.data);
                        }}
                    >
                        Put
                    </button>
                    <button
                        onClick={async () => {
                            const a = await setItem(
                                'test',
                                JSON.stringify({
                                    hello: 'world',
                                    number: Math.random() * 100,
                                })
                            );
                            console.log('Put 2', a);
                        }}
                    >
                        Put 2
                    </button>
                </div>
            </div>
        );
    }
}
