const pg =  require('pg')
const dotenv = require('dotenv')
dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: 5432,
  allowExitOnIdle: true,
});

module.exports = pool;