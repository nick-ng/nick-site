const userTable = 'user';
const markdownDocumentTable = 'markdown_document';

exports.up = function (knex) {
  return knex.schema.createTable(markdownDocumentTable, (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .references('id')
      .inTable(userTable)
      .onDelete('CASCADE');
    table.string('name', 255);
    table.text('content', 'longtext');
    table.datetime('publish_at', { useTz: true }).nullable();
    table.boolean('is_published').defaultTo(false);
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists(markdownDocumentTable);
};
