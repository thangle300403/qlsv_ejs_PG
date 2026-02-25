const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: String(process.env.PG_PASSWORD),
    database: process.env.PG_DATABASE,
    port: process.env.PG_PORT || 5432,
});

module.exports = pool;