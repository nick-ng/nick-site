const markdownDocumentTable = 'markdown_document';

exports.up = function (knex) {
  return knex.schema.raw(
    `
  CREATE TYPE markdown_document_status_temp AS ENUM ('private', 'unlisted', 'published', 'note', 'draft');
  ALTER TABLE ${markdownDocumentTable}
    ALTER COLUMN status DROP DEFAULT,
    ALTER COLUMN status TYPE markdown_document_status_temp USING status::text::markdown_document_status_temp,
    ALTER COLUMN status SET DEFAULT 'private';
  DROP TYPE IF EXISTS markdown_document_status;
  ALTER TYPE markdown_document_status_temp RENAME TO markdown_document_status;
  `
  );
};

exports.down = function (knex) {
  return knex.schema.raw(
    `
  CREATE TYPE markdown_document_status_temp AS ENUM ('private', 'unlisted', 'published');
  ALTER TABLE ${markdownDocumentTable}
    ALTER COLUMN status DROP DEFAULT,
    ALTER COLUMN status TYPE markdown_document_status_temp USING status::text::markdown_document_status_temp,
    ALTER COLUMN status SET DEFAULT 'private';
  DROP TYPE IF EXISTS markdown_document_status;
  ALTER TYPE markdown_document_status_temp RENAME TO markdown_document_status;
  `
  );
};
