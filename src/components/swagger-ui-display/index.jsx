import React from 'react';
import styled from 'styled-components';
import SwaggerUI from 'swagger-ui-react';

window.Buffer = window.Buffer || require('buffer').Buffer;

const Container = styled.div``;

export default function SwaggerUIDisplay({ spec, url }) {
  return (
    <Container>
      {spec ? <SwaggerUI spec={spec} /> : <SwaggerUI url={url} />}
    </Container>
  );
}
