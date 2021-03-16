require('dotenv').config();
// Update with your config settings.

module.exports = {
  development: {
    client: 'pg',
    connection: {
      connectionString: `${process.env.DATABASE_URL}`,
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  staging: {
    client: 'pg',
    connection: {
      connectionString: `${process.env.DATABASE_URL}`,
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: 'pg',
    connection: {
      connectionString: `${process.env.DATABASE_URL}`,
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};
