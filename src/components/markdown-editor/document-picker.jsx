import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  margin-top: 1em;
  padding-right: 1em;

  @media (max-device-width: 980px) {
    padding-right: 0.2em;
  }
`;

const DocumentLink = styled(Link)`
  display: block;
  margin 0.5em 0;
  ${(props) => {
    return props.$current ? 'font-weight: bold;' : '';
  }}

  @media (max-device-width: 980px) {
    padding: 3em 0.2em;
    margin 0;
    font-size: 0.5em;
    border: 1px solid lightgrey;
    &:nth-child(even) {
      background-color: #f5f5f5;
    }
  }
`;

export default function DocumentPicker() {
  const { documentId } = useParams();
  const [documentList, setDocumentList] = useState([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      const res = await axios.get('/api/markdown-document');

      setDocumentList(res.data);
    };
    fetchDocuments();
  }, [documentId]);

  return (
    <Container>
      <DocumentLink to="/markdown-editor">New Document</DocumentLink>
      {documentList
        .sort((a, b) => a.title.localeCompare(b.title))
        .map((document) => (
          <DocumentLink
            key={`document-${document.id}`}
            to={`/markdown-editor/${document.id}`}
            $current={document.id === parseInt(documentId, 10)}
          >
            {document.title || `Untitled (${document.id})`}
          </DocumentLink>
        ))}
    </Container>
  );
}
