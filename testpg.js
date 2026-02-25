import pool from "./model/db.js";

const { rows } = await pool.query("SELECT * FROM student");
console.log(rows);