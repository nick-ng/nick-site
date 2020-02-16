const userTable = 'user';
const bookmarkTable = 'bookmark';

exports.up = async function(knex) {
    await knex.schema.createTable(userTable, table => {
        table.increments('id').primary();
        table.string('username', 100).unique();
    });
    await knex.schema.createTable(bookmarkTable, table => {
        table.increments('id').primary();
        table
            .integer('user_id')
            .references('id')
            .inTable(userTable)
            .onDelete('CASCADE');
        table.string('url', 1000);
        table.string('name', 255);
        table.unique(['user_id', 'url']);
    });
};

exports.down = async function(knex) {
    await knex.schema.dropTableIfExists(bookmarkTable);
    await knex.schema.dropTableIfExists(userTable);
};
