import React, { useState, useEffect } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import dayjs from 'dayjs';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import debounce from 'lodash/debounce';

import { saveMarkdown, fetchDocument } from './utils';
import MarkdownDisplay from '../markdown-display';
import DocumentPicker from './document-picker';

const debouncedSaveMarkdown = debounce(
  async (setSaving, documentId, data, updatedAt, doReload = () => {}) => {
    setSaving(true);

    const { needReload, previousContent } = await saveMarkdown(
      documentId,
      data,
      updatedAt
    );

    setSaving(false);

    doReload(needReload, previousContent);
  },
  5000,
  { maxWait: 30000 }
);

const AUTOSAVE_STATUS = ['private', 'unlisted', 'draft', 'note'];

const OPTIONS = [
  {
    value: 'private',
    display: 'Private',
  },
  { value: 'note', display: 'Note' },
  { value: 'draft', display: 'Draft' },
  { value: 'published', display: 'Published' },
  { value: 'unlisted', display: 'Unlisted' },
  { value: 'swagger', display: 'Swagger' },
];

const Container = styled.div`
  display: grid;
  grid-template-columns: auto 1fr 1fr;

  @media (max-device-width: 980px) {
    grid-template-columns: auto 1fr;
  }
`;

const Controls = styled.div`
  position: sticky;
  top: 0.5em;

  a {
    margin-left: 0.5em;
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
`;

const Preview = styled.div`
  max-width: 55em;

  @media (max-device-width: 980px) {
    display: none;
  }
`;

export default function MarkdownEditor({ notesOnly }) {
  const history = useHistory();
  const location = useLocation();
  const { documentId } = useParams();
  const [documentList, setDocumentList] = useState([]);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState(dayjs().format('YYYY-MM-DD HH:mm:ss'));
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('private');
  const [publishAt, setPublishAt] = useState(dayjs().format('YYYY-MM-DD'));
  const [uri, setUri] = useState(uuid());
  const [updatedAt, setUpdatedAt] = useState('');
  const [discardedContents, setDiscardedContents] = useState([]);

  const fetchDocuments = async () => {
    const res = await axios.get('/api/markdown-document');

    const notesDocuments = res.data
      .filter(({ status }) => status === 'note')
      .sort((a, b) => dayjs(b.updatedAt) - dayjs(a.updatedAt));

    if (!documentId && notesOnly && notesDocuments.length > 0) {
      history.push(`/notes/${notesDocuments[0].id}`);
      return;
    }

    setDocumentList(res.data);
  };

  const autoSave = (newData) => {
    if (documentId && AUTOSAVE_STATUS.includes(status)) {
      debouncedSaveMarkdown(
        setSaving,
        documentId,
        {
          title,
          content,
          status,
          publishAt,
          uri,
          ...newData,
        },
        updatedAt,
        async (needReload, previousContent) => {
          if (needReload) {
            setDiscardedContents((p) =>
              p.concat({ date: new Date(), content: previousContent })
            );
          }

          const fresh = await fetchDocument(documentId);
          setTitle(fresh.title);
          setContent(fresh.content);
          setStatus(fresh.status);
          setPublishAt(dayjs(fresh.publishAt).format('YYYY-MM-DD'));
          setUri(fresh.uri || uuid());
          setUpdatedAt(fresh.updatedAt || fresh.createdAt);
          setSaving(false);
        }
      );
    }
  };

  const saveNow = async () => {
    setSaving(true);
    const {
      id: newId,
      needReload,
      previousContent,
    } = await saveMarkdown(
      documentId,
      {
        title,
        content,
        status,
        publishAt,
        uri,
      },
      updatedAt
    );

    if (newId !== documentId) {
      const basePath = notesOnly ? 'notes' : 'markdown-editor';
      fetchDocuments();
      history.push(`/${basePath}/${newId}`);
    }

    if (needReload) {
      setDiscardedContents((p) =>
        p.concat({ date: new Date(), previousContent })
      );
    }

    const fresh = await fetchDocument(documentId);
    setTitle(fresh.title);
    setContent(fresh.content);
    setStatus(fresh.status);
    setPublishAt(dayjs(fresh.publishAt).format('YYYY-MM-DD'));
    setUri(fresh.uri || uuid());
    setUpdatedAt(fresh.updatedAt || fresh.createdAt);
    setSaving(false);
  };

  useEffect(() => {
    fetchDocuments();
    if (documentId) {
      (async () => {
        const fresh = await fetchDocument(documentId);
        setTitle(fresh.title);
        setContent(fresh.content);
        setStatus(fresh.status);
        setPublishAt(dayjs(fresh.publishAt).format('YYYY-MM-DD'));
        setUri(fresh.uri || uuid());
        setUpdatedAt(fresh.updatedAt || fresh.createdAt);
        setSaving(false);
      })();
    } else {
      setTitle(dayjs().format('YYYY-MM-DD HH:mm:ss'));
      setContent('');
      setStatus(notesOnly ? 'note' : 'private');
      setPublishAt(dayjs().format('YYYY-MM-DD'));
      setUri(uuid());
    }
  }, [location.pathname]);

  return (
    <Container>
      <div>
        <DocumentPicker
          documentList={documentList}
          documentId={documentId}
          notesOnly={notesOnly}
        />
      </div>
      <div>
        <Controls>
          <h2>Editor</h2>
          <table>
            <tbody>
              <tr>
                <td colSpan={2}>
                  <button disabled={saving} onClick={saveNow}>
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  {AUTOSAVE_STATUS.includes(status) && (
                    <span>&nbsp;(Autosave on)</span>
                  )}
                </td>
              </tr>
              <tr>
                <td
                  style={{ fontSize: '10pt', paddingLeft: '3px' }}
                  colSpan={2}
                >
                  Last updated:&nbsp;
                  {dayjs(updatedAt).format('D MMM YYYY, h:mm a')}
                </td>
              </tr>
              <tr>
                <td>Title</td>
                <td>
                  <TextInput
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (documentId && AUTOSAVE_STATUS.includes(status)) {
                        debouncedSaveMarkdown(
                          (a) => {
                            if (!a) {
                              fetchDocuments();
                            }
                            setSaving(a);
                          },
                          documentId,
                          {
                            title: e.target.value,
                            content,
                            status,
                            publishAt,
                            uri,
                          }
                        );
                      }
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
                      autoSave({ status: e.target.value });
                    }}
                  >
                    {OPTIONS.map(({ value, display }) => (
                      <option key={`visibility-${value}`} value={value}>
                        {display}
                      </option>
                    ))}
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
                        autoSave({
                          publishAt:
                            e.target.value || dayjs().format('YYYY-MM-DD'),
                        });
                      }}
                    />
                  </td>
                </tr>
              )}
              {['published', 'unlisted', 'swagger'].includes(status) && (
                <tr>
                  <td>URI</td>
                  <td>
                    <TextInput
                      value={uri}
                      onChange={(e) => {
                        setUri(e.target.value);
                        autoSave({ uri: e.target.value });
                      }}
                    />
                    <a
                      href={`/view/${encodeURIComponent(uri)}`}
                      target="_blank"
                    >
                      Link
                    </a>
                  </td>
                </tr>
              )}
              {discardedContents.length > 0 && (
                <tr>
                  <td>Discarded Contents</td>
                  <td>
                    {discardedContents.map((d) => (
                      <div key={d.date.valueOf()}>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(d.content);
                          }}
                        >
                          {dayjs(d.date).format('D MMM YYYY, h:mm a')}
                        </button>
                      </div>
                    ))}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <TextEditor
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              autoSave({ content: e.target.value });
            }}
            onKeyDown={(e) => {
              if (
                (e.key == 's' || e.key == 'S') &&
                (navigator.userAgent.match('Mac') ? e.metaKey : e.ctrlKey)
              ) {
                e.preventDefault();
                debouncedSaveMarkdown.cancel();
                saveNow();
              }
            }}
          />
          {documentId && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
              }}
            >
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
            </div>
          )}
        </Controls>
      </div>
      <Preview>
        <h2>Preview</h2>
        <MarkdownDisplay content={content} />
      </Preview>
    </Container>
  );
}
