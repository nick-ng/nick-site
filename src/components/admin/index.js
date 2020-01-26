import React from 'react';
import axios from 'axios';

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
            adminKey
        });
        localStorage.setItem('adminKey', adminKey);
    }

    async testHandler() {
        const res = await axios.post('/api/test');
        console.log('axios response', res.data);
    }

    render() {
        const { adminKey } = this.state;
        return (
            <div>
                <h2>Admin Panel</h2>
                <label>
                    Admin Key:
                    <input
                        value={adminKey}
                        type='text'
                        onChange={this.adminKeyChangeHandler}
                    />
                </label>
                <button
                    onClick={this.testHandler}
                >Test</button>
            </div>
        );
    }
}
