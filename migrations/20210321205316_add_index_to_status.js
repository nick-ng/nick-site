const markdownDocumentTable = 'markdown_document';

exports.up = function (knex) {
  return knex.schema.alterTable(markdownDocumentTable, (table) => {
    table.index('status');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable(markdownDocumentTable, (table) => {
    table.dropIndex('status');
  });
};
