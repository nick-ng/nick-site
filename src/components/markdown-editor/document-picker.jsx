import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import dayjs from 'dayjs';

const PHONE_WIDTH = 20;

const Container = styled.div`
  margin-top: 1em;
  margin-right: 1em;

  @media (max-device-width: 980px) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-right: 0.2em;
    width: ${(props) => (props.$isVisible ? 'auto' : `${PHONE_WIDTH}px`)};
  }
`;

const DocumentLink = styled(Link)`
  display: block;
  margin 0.5em 0;
  ${(props) => {
    return props.$current ? 'font-weight: bold;' : '';
  }}

  @media (max-device-width: 980px) {
    width: 100%;
    box-sizing: border-box;
    padding: 2.5em 0;
    margin 0;
    font-size: 0.5em;
    border: 1px solid lightgrey;
    overflow-wrap: normal;
    overflow: clip;
    &:nth-child(even) {
      background-color: #f5f5f5;
    }
  }
`;

const VisibilityToggle = styled.button`
  display: none;
  @media (max-device-width: 980px) {
    display: block;
    width: ${PHONE_WIDTH}px;
    box-sizing: border-box;
    padding: 0.3em 0;
    text-align: center;
    border: 1px solid lightgrey;
  }
`;

export default function DocumentPicker({
  documentList,
  documentId,
  notesOnly,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const basePath = notesOnly ? 'notes' : 'markdown-editor';

  return (
    <Container $isVisible={isVisible}>
      <VisibilityToggle onClick={() => setIsVisible((prev) => !prev)}>
        {isVisible ? (
          <i className="fa fa-chevron-left " />
        ) : (
          <i className="fa fa-chevron-right " />
        )}
      </VisibilityToggle>
      {!notesOnly && (
        <DocumentLink to="/markdown-editor">New Document</DocumentLink>
      )}
      {documentList
        .filter(({ status }) => !notesOnly || status === 'note')
        .sort((a, b) =>
          notesOnly
            ? dayjs(b.updatedAt) - dayjs(a.updatedAt)
            : a.title.localeCompare(b.title)
        )
        .map((document) => (
          <DocumentLink
            $isVisible={isVisible}
            key={`document-${document.id}`}
            to={`/${basePath}/${document.id}`}
            $current={document.id === parseInt(documentId, 10)}
          >
            {document.title || `Untitled (${document.id})`}
          </DocumentLink>
        ))}
    </Container>
  );
}
