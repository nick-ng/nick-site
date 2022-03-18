import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const Container = styled.div`
  max-width: 50vw;
  width: 30em;

  q {
    padding-left: 1em;
  }
`;

const Form = styled.form`
  input {
    max-width: 30vw;
    width: 20em;
  }
`;

export default function RequestPermission() {
  const [weddingAlbumKey, setWeddingAlbumKey] = useState(
    localStorage.getItem('weddingAlbumKey')
  );
  const [weddingAlbumRequest, setWeddingAlbumRequest] = useState({});
  const [weddingAlbumNewMessage, setWeddingAlbumNewMessage] = useState('');
  const [warning, setWarning] = useState('');

  useEffect(() => {
    try {
      const albumRequest = JSON.parse(
        localStorage.getItem('weddingAlbumRequest') || '{}'
      );
      setWeddingAlbumRequest(albumRequest);
    } catch (e) {
      localStorage.setItem('weddingAlbumRequest', '{}');
    }
  }, []);

  const remainingCharacters = 100 - weddingAlbumNewMessage.length;

  return (
    <Container>
      <p>
        Write a message below so I know who the request is from and let me or my
        wife know you've requested permission (I don't check these requests very
        often).
      </p>
      <p>
        I record your IP address when you send a request so I can see if your
        request came from a sensible country.
      </p>
      {warning && <p>{warning}</p>}
      <Form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!weddingAlbumNewMessage) {
            setWarning("You didn't leave a message.");
            return;
          }
          setWarning('');
          try {
            const res = await axios.post('/api/wedding_photo_access', {
              message: weddingAlbumNewMessage,
            });

            const { key } = res.data;
            localStorage.setItem('weddingAlbumKey', key);
            setWeddingAlbumKey(key);
            localStorage.setItem(
              'weddingAlbumRequest',
              JSON.stringify({
                message: weddingAlbumNewMessage,
                timestamp: Date.now(),
              })
            );
            setWeddingAlbumRequest({
              message: weddingAlbumNewMessage,
              timestamp: Date.now(),
            });
          } catch (e) {}
        }}
      >
        <input
          type="text"
          value={weddingAlbumNewMessage}
          onChange={(e) => {
            setWeddingAlbumNewMessage(e.target.value.slice(0, 100));
          }}
        />
        <button>Send</button>
        {remainingCharacters < 20 && (
          <div style={{ marginTop: '0.5em' }}>
            {remainingCharacters} / 100 characters
          </div>
        )}
      </Form>
      {weddingAlbumRequest.timestamp ? (
        <div>
          {Date.now() - weddingAlbumRequest.timestamp <
          10 * 24 * 60 * 60 * 1000 ? (
            <>
              <p>
                You requested permission{' '}
                {dayjs(weddingAlbumRequest.timestamp).fromNow()} with the
                following message:
              </p>
              <q>{weddingAlbumRequest.message}</q>
            </>
          ) : (
            <>
              <p>
                Your previous request expired. You'll need to make a new
                request.
              </p>
            </>
          )}
          <p>
            Remember that you need to contact me or my wife otherwise I won't
            know you've requested permission.
          </p>
        </div>
      ) : null}
    </Container>
  );
}
