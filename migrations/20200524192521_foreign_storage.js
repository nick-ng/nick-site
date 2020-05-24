const userTable = 'user';
const foreignStorageTable = 'foreign_storage';

exports.up = function(knex) {
    return knex.schema.createTable(foreignStorageTable, table => {
        table.increments('id').primary();
        table
            .integer('user_id')
            .references('id')
            .inTable(userTable)
            .onDelete('CASCADE');
        table.string('key', 255);
        table.index('key');
        table.text('value', 'longtext');
        table.unique(['user_id', 'key']);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists(foreignStorageTable);
};
