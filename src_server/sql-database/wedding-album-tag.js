const camelcaseKeys = require('camelcase-keys');

const wedding_album_tag = 'wedding_album_tag';
const wedding_album_tag_relation = 'wedding_album_tag_relation';

const getAllTagsOnPhotos = (db) => async () => {
  return (
    await db
      .select(
        `${wedding_album_tag}.display_name`,
        `${wedding_album_tag}.sort_order`,
        `${wedding_album_tag}.description`,
        `${wedding_album_tag_relation}.wedding_album_tag_id`,
        `${wedding_album_tag_relation}.uri`
      )
      .from(wedding_album_tag_relation)
      .join(
        wedding_album_tag,
        `${wedding_album_tag_relation}.wedding_album_tag_id`,
        '=',
        `${wedding_album_tag}.id`
      )
  ).map((a) => camelcaseKeys(a));
};

const addTagToPhoto =
  (db) =>
  ({ uri, tagId }) =>
    db(wedding_album_tag_relation).insert({
      uri,
      wedding_album_tag_id: tagId,
    });

const getAllTags = (db) => async () =>
  (await db.raw(`select * from ${wedding_album_tag}`)).rows.map((a) =>
    camelcaseKeys(a)
  );

// const createTag =
//   (db) =>
//   ({ displayName, sortOrder, description }) =>
//     db(wedding_album_tag).insert({
//       display_name: displayName,
//       sort_order: sortOrder,
//       description,
//     });

const createTag =
  (db) =>
  ({ displayName, sortOrder, description }) =>
    db.raw(
      `INSERT INTO ${wedding_album_tag}
    (display_name, sort_order, description)
    VALUES (:displayName, :sortOrder, :description)
    ON CONFLICT (display_name) DO UPDATE SET
    sort_order = :sortOrder,
    description = :description
    `,
      { displayName, sortOrder, description }
    );

module.exports = (db) => ({
  getAllTagsOnPhotos: getAllTagsOnPhotos(db),
  addTagToPhoto: addTagToPhoto(db),
  getAllTags: getAllTags(db),
  createTag: createTag(db),
});
