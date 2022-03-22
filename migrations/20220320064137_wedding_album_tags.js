const wedding_album_tag = 'wedding_album_tag';
const wedding_album_tag_relation = 'wedding_album_tag_relation';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable(wedding_album_tag, (table) => {
      table.increments('id').primary();
      table.string('display_name', 100).unique();
      table.float('sort_order');
      table.string('description', 255);
    })
    .then(() =>
      knex.schema.createTable(wedding_album_tag_relation, (table) => {
        table.increments('id').primary();
        table
          .integer('wedding_album_tag_id')
          .references('id')
          .inTable(wedding_album_tag)
          .onDelete('CASCADE');
        table.string('uri', 2000);
        table.unique(['wedding_album_tag_id', 'uri']);
      })
    );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists(wedding_album_tag_relation)
    .then(() => knex.schema.dropTableIfExists(wedding_album_tag));
};
