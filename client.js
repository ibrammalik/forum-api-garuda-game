/* eslint-disable no-console */
/* istanbul ignore file */
require('dotenv').config();
const { Client } = require('pg');

const pgclient = new Client({
  host: process.env.PGHOST_TEST,
  port: process.env.PGPORT_TEST,
  user: process.env.PGUSER_TEST,
  password: process.env.PGPASSWORD_TEST,
});
const database = process.env.PGDATABASE_TEST;

async function setupDatabase() {
  try {
    await pgclient.connect();
    const res = await pgclient.query(`SELECT datname FROM pg_catalog.pg_database WHERE datname = '${database}'`);
    if (res.rowCount === 0) {
      console.log(`${database} database not found, creating it.`);
      await pgclient.query(`CREATE DATABASE "${database}";`);
      console.log(`created database ${database}.`);
    } else {
      console.log(`${database} database already exists.`);
    }
  } catch (error) {
    console.error(error.stack);
  } finally {
    await pgclient.end();
  }
}

setupDatabase();
