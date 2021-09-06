import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import VoiceChooser from './voice-chooser';
import {
  getVoices,
  sayMultiplePhrases,
  stopTalking,
  pauseTalking,
  resumeTalking,
  VOICE_CHARACTER_STORE,
  VOICE_VOLUME_STORE,
} from './text-to-speech';

const VOICE_RATE_STORE = 'VOICE_RATE_NICK_SITE';
const VOICE_PREV_PHRASE_STORE = 'VOICE_PREV_PHRASE_NICK_SITE';
const VOICE_PARAGRAPH_NUMBER_STORE = 'VOICE_PARAGRAPH_NUMBER_STORE';

const Container = styled.div`
  & > * {
    margin-bottom: 0.2em;
  }
`;

const InlineLabel = styled.label`
  display: flex;
  flex-directon: row;
  align-items: center;
`;

const ParagraphStart = styled.div`
  max-width: 30em;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Textarea = styled.textarea`
  display: block;
  margin: 0;
  width: 70vw;
  height: 70vh;
  resize: none;
`;

export default function TextToSpeech() {
  const [voices, setVoices] = useState([]);
  const [voice, setVoice] = useState(
    localStorage.getItem(VOICE_CHARACTER_STORE) || ''
  );
  const [voiceVolume, setVoiceVolume] = useState(
    parseFloat(localStorage.getItem(VOICE_VOLUME_STORE) ?? 0.3)
  );
  const [voiceRate, setVoiceRate] = useState(
    parseFloat(localStorage.getItem(VOICE_RATE_STORE) ?? 1)
  );
  const [phrase, setPhrase] = useState(
    localStorage.getItem(VOICE_PREV_PHRASE_STORE) ?? ''
  );
  const [paragraphs, setParagraphs] = useState([]);
  const [paragraphNumber, setParagraphNumber] = useState(
    parseInt(localStorage.getItem(VOICE_PARAGRAPH_NUMBER_STORE) ?? 0)
  );

  useEffect(() => {
    const populateVoices = async () => {
      setVoices(await getVoices());
    };
    populateVoices();

    return () => {
      stopTalking();
    };
  }, []);

  useEffect(() => {
    setParagraphs(phrase.split('\n').filter((b) => b));
  }, [phrase]);

  useEffect(() => {
    localStorage.setItem(VOICE_PARAGRAPH_NUMBER_STORE, paragraphNumber);
  }, [paragraphNumber]);

  return (
    <Container>
      <h2>Text to Speech</h2>
      <InlineLabel>
        Voice:&nbsp;
        <VoiceChooser
          voices={voices}
          voice={voice}
          onChange={(newVoice) => {
            setVoice(newVoice);
            localStorage.setItem(VOICE_CHARACTER_STORE, newVoice);
          }}
        />
      </InlineLabel>
      <InlineLabel>
        Volume:&nbsp;
        <input
          value={voiceVolume}
          type="number"
          min="0"
          max="1"
          step="0.05"
          onChange={(e) => {
            setVoiceVolume(parseFloat(e.target.value));
            localStorage.setItem(VOICE_VOLUME_STORE, e.target.value);
          }}
        />
      </InlineLabel>
      <InlineLabel>
        Rate:&nbsp;
        <input
          value={voiceRate}
          type="number"
          min="0"
          max="10"
          step="0.1"
          onChange={(e) => {
            setVoiceRate(parseFloat(e.target.value));
            localStorage.setItem(VOICE_RATE_STORE, e.target.value);
          }}
        />
      </InlineLabel>
      <InlineLabel>
        Paragraph:&nbsp;
        <input
          value={paragraphNumber}
          type="number"
          onChange={(e) => {
            setParagraphNumber(parseInt(e.target.value, 10));
          }}
        />
        &nbsp;
        <ParagraphStart>{paragraphs[paragraphNumber]}</ParagraphStart>
      </InlineLabel>
      <button
        onClick={() => {
          sayMultiplePhrases(
            paragraphs,
            voice,
            {
              volume: voiceVolume,
              rate: voiceRate,
              start: paragraphNumber,
            },
            (i) => setParagraphNumber(i)
          );
        }}
      >
        Start
      </button>
      &nbsp;
      <button onClick={stopTalking}>Stop</button>
      &nbsp;
      <button onClick={pauseTalking}>Pause</button>
      &nbsp;
      <button onClick={resumeTalking}>Resume</button>
      <Textarea
        value={phrase}
        onChange={(e) => {
          const a = e.target.value;
          setParagraphNumber(0);
          setPhrase(a);
          localStorage.setItem(VOICE_PREV_PHRASE_STORE, a);
        }}
      />
    </Container>
  );
}
