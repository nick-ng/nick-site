import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import ConfettiStandAlone from '../confetti-stand-alone';

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const Controls = styled.div`
  margin-top: 1em;
  display: flex;
  flex-direction: column;

  a {
    margin-bottom: 0.5em;
  }
`;

const LinkControls = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const Warning = styled.p`
  font-size: 1em;
  border: 1px solid red;
  padding: 0.5em;
`;

const TextEditor = styled.textarea`
  width: 93%;
  height: 60vh;
  resize: none;
  position: sticky;
  top: 1em;
`;

export default function ConfettiMaker() {
  const [message, setMessage] = useState(`## Type your message here

You can format your message in [Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)`);

  const urlEncodeMessage = encodeURIComponent(message);
  const fullUrl = `${location.origin}/confetti?m=${urlEncodeMessage}`;

  return (
    <Container>
      <Controls>
        <LinkControls>
          <a href={fullUrl} target="_blank">
            Link
          </a>
          <button
            onClick={() => {
              navigator.clipboard.writeText(fullUrl);
            }}
          >
            Copy Link
          </button>
        </LinkControls>
        {fullUrl.length > 2000 && (
          <Warning>
            Your message is too long. Shorten it by {fullUrl.length - 2000}{' '}
            characters
          </Warning>
        )}
        <TextEditor
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
      </Controls>
      <ConfettiStandAlone message={message} />
    </Container>
  );
}
