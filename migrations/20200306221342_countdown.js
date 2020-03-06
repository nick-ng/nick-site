const userTable = 'user';
const countdownTable = 'countdown';

exports.up = function(knex) {
    return knex.schema.createTable(countdownTable, table => {
        table.increments('id').primary();
        table
            .integer('user_id')
            .references('id')
            .inTable(userTable)
            .onDelete('CASCADE');
        table.datetime('end_time', { useTz: true });
        table.string('name', 255);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists(countdownTable);
};
