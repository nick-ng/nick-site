const markdownDocumentTable = 'markdown_document';

exports.up = function (knex) {
  return knex.schema.alterTable(markdownDocumentTable, (table) => {
    table.dropColumn('is_published');
    table
      .enu('status', ['private', 'unlisted', 'published'], {
        useNative: true,
        enumName: 'markdown_document_status',
      })
      .defaultTo('private');
    table.string('uri', 255).nullable();
  });
};

exports.down = function (knex) {
  return knex.schema
    .alterTable(markdownDocumentTable, (table) => {
      table.dropColumn('status');
      table.dropColumn('uri');
      table.boolean('is_published').defaultTo(false);
    })
    .raw('DROP TYPE markdown_document_status');
};
