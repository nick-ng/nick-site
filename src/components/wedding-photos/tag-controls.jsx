import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.details`
  margin-bottom: 0.5em;
  position: relative;

  &[hover] * {
    background-color: white;
  }
`;

const Summary = styled.summary`
  cursor: pointer;
  display: flex;
  justify-content: center;
  user-select: none;

  div {
    width: 1em;
    text-align: center;
  }
`;

const Tags = styled.div`
  margin-top: 0.3em;
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 20vw;
`;

const Tag = styled.button`
  margin: 0.3em;
  color: ${(props) => (props.selected ? 'white' : 'black')};
  background-color: ${(props) => (props.selected ? '#888888' : 'white')};
  border-radius: 99em;
  border: 1px solid grey;
  padding: 0.3em 0.5em;
  cursor: pointer;
`;

export default function TagControls({
  allTags,
  selectedTags,
  setSelectedTags,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Container
      onToggle={(e) => {
        setIsOpen(e.target.open);
      }}
    >
      <Summary>
        <div>
          <i className={`fa ${isOpen ? 'fa-caret-down' : 'fa-caret-right'}`} />
        </div>
        Tags
      </Summary>
      <Tags>
        <Tag
          onClick={() => {
            if (selectedTags.length > 0) {
              setSelectedTags([]);
            }
          }}
        >
          Reset
        </Tag>
        {allTags.map((tag) => (
          <Tag
            key={tag}
            selected={selectedTags.includes(tag)}
            onClick={() => {
              if (selectedTags.includes(tag)) {
                setSelectedTags((prev) => [...prev].filter((a) => a !== tag));
              } else {
                setSelectedTags((prev) => [...prev, tag]);
              }
            }}
          >
            {tag}
          </Tag>
        ))}
      </Tags>
    </Container>
  );
}
