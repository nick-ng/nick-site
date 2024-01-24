import React from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

const StyledReactMarkdown = styled(ReactMarkdown)`
  table {
    border-collapse: collapse;

    th {
      padding: 0.5em;
    }

    td {
      padding: 0.3em 0.5em;
    }

    th,
    td {
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

  img {
    max-width: 55em;
  }
`;

export default function MarkdownDisplay({ className, content }) {
  return (
    <StyledReactMarkdown
      className={className}
      remarkPlugins={[gfm]}
      linkTarget="_blank"
    >
      {content}
    </StyledReactMarkdown>
  );
}
