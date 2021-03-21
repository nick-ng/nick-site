import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

import MarkdownDisplay from '../markdown-display';
import Loading from '../loading';

const Container = styled.div``;

export default function MarkdownViewer() {
  const history = useHistory();
  const { uri: documentUri } = useParams();
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const fetchDocument = async (uri) => {
    setLoading(true);
    const res = await axios.get(`/api/markdown-document/uri/${uri}`);

    const { content, title } = res.data;
    setTitle(title);
    setContent(content);
    setLoading(false);
    if (content === undefined) {
      history.push('/');
    }
  };

  useEffect(() => {
    fetchDocument(documentUri);
  }, [documentUri]);

  return (
    <Container>
      {loading ? (
        <div style={{ marginTop: '1em' }}>
          <Loading />
        </div>
      ) : (
        <MarkdownDisplay content={content} />
      )}
    </Container>
  );
}