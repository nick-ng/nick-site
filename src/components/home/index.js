import React from 'react';
import styled from 'styled-components';
import moment from 'moment';

import AnniversaryCountdown from '../anniversary-countdown';

const HomeContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const DayDisplay = styled.div`
    font-size: 8vw;
    font-weight: bold;
`;

export default class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dateMoment: moment(),
            intervalId: null,
        };
    }

    componentDidMount() {
        const intervalId = setInterval(() => {
            this.setState({
                dateMoment: moment(),
            });
        }, 60000);

        this.setState({
            intervalId,
        });
    }

    componentWillUnmount() {
        const { intervalId } = this.state;
        if (typeof intervalId === 'number') {
            clearInterval(intervalId);
        }
    }

    render() {
        const { dateMoment } = this.state;

        return (
            <HomeContainer>
                <AnniversaryCountdown />
                <div>Today is</div>
                <DayDisplay>{dateMoment.format('dddd')}</DayDisplay>
            </HomeContainer>
        );
    }
}
