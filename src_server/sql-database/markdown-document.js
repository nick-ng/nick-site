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

const getPublicDocuments = (db) => async (count = 5, offset = 0) => {
  return (
    await db
      .select(['title', 'content', 'publish_at', 'status', 'uri'])
      .from(markdownDocumentTable)
      .where('status', 'published')
      .limit(count)
      .offset(offset)
      .orderBy([
        { column: 'publish_at', order: 'desc' },
        { column: 'created_at', order: 'desc' },
      ])
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

const getDocumentByUri = (db) => async (uri) => {
  return camelcaseKeys(
    await db
      .first(['title', 'content'])
      .from(markdownDocumentTable)
      .where({
        uri,
      })
      .whereIn('status', ['unlisted', 'published'])
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

const deleteDocumentById = (db) => (id, userId) => {
  return db(markdownDocumentTable)
    .where({
      user_id: userId,
      id,
    })
    .del();
};

module.exports = (db) => ({
  getDocumentsForUser: getDocumentsForUser(db),
  getPublicDocuments: getPublicDocuments(db),
  getDocumentByIdForUser: getDocumentByIdForUser(db),
  getDocumentByUri: getDocumentByUri(db),
  addDocumentForUser: addDocumentForUser(db),
  updateDocumentById: updateDocumentById(db),
  deleteDocumentById: deleteDocumentById(db),
});
