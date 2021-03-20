const markdownDocumentTable = 'markdown_document';

exports.up = function (knex) {
  return knex.schema.alterTable(markdownDocumentTable, (table) => {
    table.renameColumn('name', 'title');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable(markdownDocumentTable, (table) => {
    table.renameColumn('title', 'name');
  });
};
