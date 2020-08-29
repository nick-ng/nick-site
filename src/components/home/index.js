import React from 'react';
import styled from 'styled-components';
import moment from 'moment';

import AnniversaryCountdown from '../anniversary-countdown';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DayDisplay = styled.span`
  font-size: 1.5em;
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

    const urlParams = new URLSearchParams(window.location.search);
    const guestKey = urlParams.get('guestkey');
    if (guestKey) {
      localStorage.setItem('adminKey', guestKey);
      window.location.href = window.location.href.split('?')[0];
    }
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
        <div>
          Today is <DayDisplay>{dateMoment.format('dddd')}</DayDisplay>
        </div>
      </HomeContainer>
    );
  }
}
