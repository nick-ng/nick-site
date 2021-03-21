const markdownDocumentTable = 'markdown_document';

exports.up = function (knex) {
  return knex.schema.alterTable(markdownDocumentTable, (table) => {
    table.index('uri');
    table.index('publish_at');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable(markdownDocumentTable, (table) => {
    table.dropIndex('uri');
    table.dropIndex('publish_at');
  });
};
