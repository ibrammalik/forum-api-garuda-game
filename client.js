/* eslint-disable no-console */
/* istanbul ignore file */
require('dotenv').config();
const { Client } = require('pg');

const pgclient = new Client({
  host: process.env.PGHOST_TEST,
  port: process.env.PGPORT_TEST,
  user: process.env.PGUSER_TEST,
  password: process.env.PGPASSWORD_TEST,
  database: process.env.PGDATABASE_TEST,
});

async function setupDatabase() {
  try {
    await pgclient.connect();
    const res = await pgclient.query(`SELECT datname FROM pg_catalog.pg_database WHERE datname = '${pgclient.database}'`);
    if (res.rowCount === 0) {
      console.log(`${pgclient.database} database not found, creating it.`);
      await pgclient.query(`CREATE DATABASE "${pgclient.database}";`);
      console.log(`created database ${pgclient.database}.`);
    } else {
      console.log(`${pgclient.database} database already exists.`);
    }
    console.log('Database created');
  } catch (error) {
    console.error(error.stack);
  } finally {
    await pgclient.end();
  }
}

setupDatabase();
