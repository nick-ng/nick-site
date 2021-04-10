import React from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

const StyledReactMarkdown = styled(ReactMarkdown)`
  table {
    border-collapse: collapse;

    th,
    td {
      padding: 0.5em;
      border: 1px solid lightgrey;
    }

    tr:nth-child(odd) {
      td {
        background-color: white;
      }
    }

    tr:nth-child(even) {
      td {
        background-color: #f5f5f5;
      }
    }
  }

  li {
    line-height: 1.5;
  }
`;

export default function MarkdownDisplay({ className, content }) {
  return (
    <StyledReactMarkdown
      className={className}
      plugins={[gfm]}
      linkTarget="_blank"
    >
      {content}
    </StyledReactMarkdown>
  );
}
