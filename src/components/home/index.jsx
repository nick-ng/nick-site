import React from 'react';
import styled from 'styled-components';

import AnniversaryCountdown from '../anniversary-countdown';
import Blog from '../blog';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      intervalId: null,
    };
  }

  componentWillUnmount() {
    const { intervalId } = this.state;
    if (typeof intervalId === 'number') {
      clearInterval(intervalId);
    }
  }

  render() {
    return (
      <HomeContainer>
        <AnniversaryCountdown />
        <Blog />
      </HomeContainer>
    );
  }
}
