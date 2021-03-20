import axios from 'axios';

export const markdownFixer = (originalContent) =>
  originalContent.replace(
    /\S {2,}\S/gm,
    (originalString) =>
      `${originalString[0]} ${originalString[originalString.length - 1]}`
  );

// {title, content, status, publishAt, uri}
export const saveMarkdown = async (
  id,
  { title, content, status, publishAt, uri }
) => {
  if (typeof id === 'string') {
    await axios.put(`/api/markdown-document/id/${id}`, {
      title,
      content: markdownFixer(content),
      status,
      publishAt,
      uri,
    });

    return id;
  }

  const res = await axios.post('/api/markdown-document', {
    title,
    content: markdownFixer(content),
    status,
    publishAt,
    uri,
  });

  console.log('res.data', res.data);

  return res.data.id;
};
