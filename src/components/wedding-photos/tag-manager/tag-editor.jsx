import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const fetcher = async (setTags) => {
  const res = await axios.get('/api/wedding_album_tags');

  setTags(res.data);
};

const Container = styled.div``;

const ThreeColumns = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-gap: 1em;
`;

const TagPicker = styled.div`
  display: flex;
  flex-direction: column;
`;

const Tag = styled.button`
  background-color: ${(props) => (props.selected ? '#555' : '#aaa')};
  color: ${(props) => (props.selected ? 'white' : 'black')};
  border: 1px solid grey;
  box-sizing: border-box;
  padding: 0.2em 0.5em;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  label {
    margin-bottom: 0.5em;

    span {
      margin-right: 1em;
    }
  }

  button {
    min-width: 10em;
  }
`;

export default function TagEditor({ tags, setTags }) {
  const [currentTagId, setCurrentTagId] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetcher(setTags);
  }, []);

  useEffect(() => {
    if (tags.length > 0 && currentTagId === null) {
      setCurrentTagId(
        [...tags].sort((a, b) => a.sortOrder - b.sortOrder)[0].id
      );
    }
  }, [JSON.stringify(tags)]);

  useEffect(() => {
    if (currentTagId === 0) {
      setDisplayName('');
      setSortOrder('88');
      setDescription('');
    }
    const currentTagArray = tags.filter((tag) => tag.id === currentTagId);
    if (currentTagArray.length === 1) {
      const {
        displayName: newDisplayName,
        sortOrder: newSortOrder,
        description: newDescription,
      } = currentTagArray[0];
      setDisplayName(newDisplayName);
      setSortOrder(newSortOrder);
      setDescription(newDescription);
    }
  }, [currentTagId]);

  return (
    <Container>
      <h2>BBB</h2>
      <ThreeColumns>
        <TagPicker>
          <Tag
            selected={currentTagId === 0}
            onClick={() => {
              setCurrentTagId(0);
            }}
          >
            New
          </Tag>
          {[...tags]
            .sort((a, b) => a.displayName.localeCompare(b.displayName))
            .map((tag) => (
              <Tag
                key={tag.id}
                selected={currentTagId === tag.id}
                onClick={() => {
                  setCurrentTagId(tag.id);
                }}
              >
                {tag.displayName}
              </Tag>
            ))}
        </TagPicker>
        <Form
          onSubmit={async (e) => {
            e.preventDefault();
            await axios.post('/api/wedding_album_tag', {
              displayName,
              sortOrder,
              description,
            });

            fetcher(setTags);
          }}
        >
          <label>
            <span>Tag Name</span>
            <input
              type="text"
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
              }}
            />
          </label>
          <label>
            <span>Sort Order</span>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
              }}
            />
          </label>
          <label>
            <span>Description</span>
            <input
              type="text"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </label>
          <button>OK</button>
        </Form>
        <div>
          <span>Tag Order</span>
          <ol>
            {[...tags]
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((tag) => (
                <li key={tag.id}>{tag.displayName}</li>
              ))}
          </ol>
        </div>
      </ThreeColumns>
    </Container>
  );
}
