const mediaCategoryTable = 'media_category';
const mediaTypeTable = 'media_type';
const mediaTable = 'media';
const mediaCategoryRelationTable = 'media_category_relation';

exports.up = function (knex) {
    return Promise.all([
        knex.schema.createTable(mediaCategoryTable, (table) => {
            table.increments('id').primary();
            table.string('name', 100).unique();
        }),
        knex.schema.createTable(mediaTypeTable, (table) => {
            table.increments('id').primary();
            table.string('name', 100).unique();
        }),
    ])
        .then(() => knex.schema.createTable(mediaTable, (table) => {
            table.increments('id').primary();
            table.string('uri', 1000).unique();
            table.integer('type_id').references('id').inTable(mediaTypeTable).onDelete('CASCADE');
        }))
        .then(() => knex.schema.createTable(mediaCategoryRelationTable, (table) => {
            table.increments('id').primary();
            table.integer('media_id').references('id').inTable(mediaTable).onDelete('CASCADE');
            table.integer('media_category_id').references('id').inTable(mediaCategoryTable).onDelete('CASCADE');
        }))
        .then(() => knex.insert([
            { name: 'image' },
            { name: 'video' },
        ]).into(mediaTypeTable));
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists(mediaCategoryRelationTable)
        .then(() => knex.schema.dropTableIfExists(mediaTable))
        .then(() => Promise.all([
            knex.schema.dropTableIfExists(mediaTypeTable),
            knex.schema.dropTableIfExists(mediaCategoryTable),
        ]));
};
