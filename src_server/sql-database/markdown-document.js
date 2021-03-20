const camelcaseKeys = require('camelcase-keys');

const markdownDocumentTable = 'markdown_document';

/**
 * @typedef {Object} mdDocumentInput
 * @property {string} title
 * @property {string} content
 * @property {string} publishAt Date
 * @property {string} status
 * @property {string} uri
 */

/**
 * @typedef {Object} mdDocumentOutput
 * @property {number} id
 * @property {string} title
 * @property {string} content
 * @property {string} publishAt
 * @property {string} status
 * @property {string} uri
 * @property {string} createdAt
 * @property {string} updatedAt
 */

const getDocumentsForUser = (db) => async (userId) => {
  return (
    await db
      .select([
        'id',
        'title',
        'publish_at',
        'status',
        'uri',
        'created_at',
        'updated_at',
      ])
      .from(markdownDocumentTable)
      .where('user_id', userId)
  ).map((a) => camelcaseKeys(a));
};

const getDocumentByIdForUser = (db) => async (userId, documentId) => {
  return camelcaseKeys(
    await db
      .first([
        'id',
        'title',
        'content',
        'publish_at',
        'status',
        'uri',
        'created_at',
        'updated_at',
      ])
      .from(markdownDocumentTable)
      .where({ user_id: userId, id: documentId })
  );
};

const addDocumentForUser = (db) => (
  userId,
  { title, content, publishAt, status, uri }
) =>
  db(markdownDocumentTable).insert(
    {
      user_id: userId,
      title,
      content,
      publish_at: publishAt,
      status,
      uri,
    },
    ['id']
  );

const updateDocumentById = (db) => (
  id,
  userId,
  { title, content, publishAt, status, uri }
) => {
  const newDocumentData = Object.entries({
    title,
    content,
    publish_at: publishAt,
    status,
    uri,
  }).reduce((prev, curr) => {
    const [key, value] = curr;
    if (value) {
      prev[key] = value;
    }
    return prev;
  }, {});

  if (Object.keys(newDocumentData).length > 0) {
    return db(markdownDocumentTable)
      .where({
        user_id: userId,
        id,
      })
      .update({ ...newDocumentData });
  }

  return false;
};

module.exports = (db) => ({
  getDocumentsForUser: getDocumentsForUser(db),
  getDocumentByIdForUser: getDocumentByIdForUser(db),
  addDocumentForUser: addDocumentForUser(db),
  updateDocumentById: updateDocumentById(db),
});
