import axios from 'axios';

export const markdownFixer = (originalContent) =>
  originalContent.replace(
    /\S {2,}\S/gm,
    (originalString) =>
      `${originalString[0]} ${originalString[originalString.length - 1]}`
  );

export const fetchDocument = async (id) => {
  const res = await axios.get(`/api/markdown-document/id/${id}`);

  return res.data;
};

// {title, content, status, publishAt, uri}
export const saveMarkdown = async (
  id,
  { title, content, status, publishAt, uri, updatedAt }
) => {
  if (typeof id === 'string') {
    const prevData = await fetchDocument(id);

    const dbDate = new Date(prevData.updatedAt || prevData.createdAt);
    const localDate = new Date(updatedAt);

    if (dbDate > localDate) {
      return { id, needReload: true, previousContent: content };
    }

    await axios.put(`/api/markdown-document/id/${id}`, {
      title,
      content: markdownFixer(content),
      status,
      publishAt,
      uri,
    });

    return { id, needReload: false };
  }

  const res = await axios.post('/api/markdown-document', {
    title,
    content: markdownFixer(content),
    status,
    publishAt,
    uri,
  });

  return { id: res.data.id, needReload: true };
};
