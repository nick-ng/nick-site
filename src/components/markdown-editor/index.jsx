import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import dayjs from 'dayjs';
import axios from 'axios';
import { v4 as uuid } from 'uuid';

import { saveMarkdown } from './utils';
import MarkdownDisplay from '../markdown-display';
import DocumentPicker from './document-picker';

const Container = styled.div`
  display: grid;
  grid-template-columns: auto 1fr 1fr;

  @media (max-device-width: 980px) {
    grid-template-columns: auto 1fr;
  }
`;

const Controls = styled.table`
  a {
    margin-left: 0.5em;

    @media (max-device-width: 980px) {
      display: none;
    }
  }

  button + button {
    margin-left: 1em;
  }
`;

const TextInput = styled.input`
  width: 20vw;
`;

const TextEditor = styled.textarea`
  width: 93%;
  height: 60vh;
  resize: none;
  position: sticky;
  top: 1em;
`;

const Preview = styled.div`
  @media (max-device-width: 980px) {
    display: none;
  }
`;

export default function MarkdownEditor() {
  const history = useHistory();
  const { documentId } = useParams();
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState(dayjs().format('YYYY-MM-DD HH:mm:ss'));
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('private');
  const [publishAt, setPublishAt] = useState(dayjs().format('YYYY-MM-DD'));
  const [uri, setUri] = useState(uuid());

  const fetchDocument = async (id) => {
    const res = await axios.get(`/api/markdown-document/id/${id}`);

    const { content, publishAt, status, title, uri } = res.data;
    setTitle(title);
    setContent(content);
    setStatus(status);
    setPublishAt(dayjs(publishAt).format('YYYY-MM-DD'));
    setUri(uri || uuid());
    setSaving(false);
  };

  useEffect(() => {
    if (documentId) {
      fetchDocument(documentId);
    } else {
      setTitle(dayjs().format('YYYY-MM-DD HH:mm:ss'));
      setContent('');
      setStatus('private');
      setPublishAt(dayjs().format('YYYY-MM-DD'));
      setUri(uuid());
    }
  }, [documentId]);

  return (
    <Container>
      <div>
        <DocumentPicker />
      </div>
      <div>
        <h2>Editor</h2>
        <Controls>
          <tbody>
            <tr>
              <td colSpan={2}>
                <button
                  disabled={saving}
                  onClick={async () => {
                    setSaving(true);
                    const newId = await saveMarkdown(documentId, {
                      title,
                      content,
                      status,
                      publishAt,
                      uri,
                    });

                    if (newId === documentId) {
                      fetchDocument(documentId);
                    }
                    history.push(`/markdown-editor/${newId}`);
                  }}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </td>
            </tr>
            <tr>
              <td>Title</td>
              <td>
                <TextInput
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>Visibility</td>
              <td>
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                  }}
                >
                  <option value="private">Private</option>
                  <option value="unlisted">Unlisted</option>
                  <option value="published">Published</option>
                </select>
              </td>
            </tr>
            {status === 'published' && (
              <tr>
                <td>Publish Date</td>
                <td>
                  <input
                    type="date"
                    value={publishAt}
                    onChange={(e) => {
                      setPublishAt(
                        e.target.value || dayjs().format('YYYY-MM-DD')
                      );
                    }}
                  />
                </td>
              </tr>
            )}
            {status !== 'private' && (
              <tr>
                <td>URI</td>
                <td>
                  <TextInput
                    value={uri}
                    onChange={(e) => {
                      setUri(e.target.value);
                    }}
                  />
                  <a href={`/view/${encodeURIComponent(uri)}`} target="_blank">
                    Link
                  </a>
                </td>
              </tr>
            )}
            {documentId && (
              <tr>
                <td colSpan={2}>
                  <button
                    onClick={async () => {
                      const res = confirm(`Delete document ${title}?`);
                      if (res) {
                        await axios.delete(
                          `/api/markdown-document/id/${documentId}`
                        );
                        history.push('/markdown-editor');
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </Controls>
        <TextEditor
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
          }}
        />
      </div>
      <Preview>
        <h2>Preview</h2>
        <MarkdownDisplay content={content} />
      </Preview>
    </Container>
  );
}
