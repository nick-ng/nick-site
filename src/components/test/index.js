import React from 'react';

export default class AnniversaryCountdown extends React.Component {
    constructor(props) {
        super(props);

        setTimeout(() => {
            window.open('https://www.youtube.com/watch?v=PWgvGjAhvIw', '_blank');
        }, 1000);
    }

    render() {
        return <p>Opening a new tab in 1 seconds.</p>;
    }
}
