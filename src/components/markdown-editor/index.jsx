import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import moment from 'moment';
import axios from 'axios';

import { saveMarkdown } from './utils';
import MarkdownDisplay from '../markdown-display';
import DocumentPicker from './document-picker';

const Container = styled.div`
  display: grid;
  grid-template-columns: auto 1fr 1fr;
`;

const Controls = styled.table``;

const TextInput = styled.input`
  width: 20vw;
`;

const TextEditor = styled.textarea`
  width: 93%;
  height: 50vh;
  resize: none;
`;

export default function MarkdownEditor(props) {
  const history = useHistory();
  const { documentId } = useParams();
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('private');
  const [publishAt, setPublishAt] = useState(moment().format('YYYY-MM-DD'));
  const [uri, setUri] = useState();

  const fetchDocument = async (id) => {
    const res = await axios.get(`/api/markdown-document/id/${id}`);

    const { content, publishAt, status, title, uri } = res.data;
    setTitle(title);
    setContent(content);
    setStatus(status);
    setPublishAt(publishAt);
    setUri(uri);
    setSaving(false);
  };

  useEffect(() => {
    if (documentId) {
      fetchDocument(documentId);
    } else {
      setTitle('');
      setContent('');
      setStatus('private');
      setPublishAt(moment().format('YYYY-MM-DD'));
      setUri();
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
                        e.target.value || moment().format('YYYY-MM-DD')
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
      <div>
        <h2>Preview</h2>
        <MarkdownDisplay content={content} />
      </div>
    </Container>
  );
}
