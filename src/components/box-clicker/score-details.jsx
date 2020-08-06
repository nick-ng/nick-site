import React from 'react';
import styled from 'styled-components';
import moment from 'moment';

const Container = styled.div`
  position: absolute;
  top: -1em;
  right: -2em;
  padding: 0.3em 0.5em;
  border-bottom: 1px solid grey;
  border-left: 1px solid grey;
  background-color: white;
  display: grid;
  grid-template-columns: auto auto;
  gap: 0.5em;
`;

const Left = styled.div``;
const Right = styled.div`
  text-align: right;
`;

const ScoreDetails = ({ score }) => {
  return score.name ? (
    <Container>
      <Left>Player</Left>
      <Right>{score.name}</Right>
      <Left>Time</Left>
      <Right>{score.time}</Right>
      <Left>Date</Left>
      <Right>{moment(score.end).format('Do MMM YYYY')}</Right>
    </Container>
  ) : null;
};

export default ScoreDetails;
