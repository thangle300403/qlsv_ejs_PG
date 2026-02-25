const pool = require("./db");

class Register {
    constructor(id, student_id, subject_id, score, student_name, subject_name) {
        this.id = id;
        this.student_id = student_id;
        this.subject_id = subject_id;
        this.score = score;
        this.student_name = student_name;
        this.subject_name = subject_name;
    }

    static SELECT_ALL_QUERY = `
    SELECT register.*, student.name as student_name, subject.name as subject_name
    FROM register
    JOIN student ON register.student_id = student.id
    JOIN subject ON register.subject_id = subject.id
  `;

    static buildLimit = (page = null, item_per_page = null, startIndex = 1) => {
        let limit = "";
        let params = [];

        if (page && item_per_page) {
            const offset = (page - 1) * item_per_page;

            // LIMIT $startIndex OFFSET $(startIndex+1)
            limit = ` LIMIT $${startIndex} OFFSET $${startIndex + 1}`;
            params = [item_per_page, offset];
        }

        return { limit, params };
    };


    static convertArrayToObjects = (rows) => {
        return rows.map(
            (row) =>
                new Register(
                    row.id,
                    row.student_id,
                    row.subject_id,
                    row.score != null ? Number(row.score).toFixed(2) : null,
                    row.student_name,
                    row.subject_name
                )
        );
    };

    static all = async (page = null, item_per_page = null) => {
        try {
            const { limit, params } = this.buildLimit(page, item_per_page);
            const result = await pool.query(`${this.SELECT_ALL_QUERY} ${limit}`, params);
            return this.convertArrayToObjects(result.rows);
        } catch (error) {
            throw new Error(error.message);
        }
    };

    static getByPattern = async (search, page = null, item_per_page = null) => {
        try {
            const { limit, params: limitParams } = this.buildLimit(page, item_per_page);

            const sql = `
        ${this.SELECT_ALL_QUERY}
        WHERE CAST(register.student_id AS TEXT) ILIKE $1
           OR subject.name ILIKE $2
        ${limit}
      `;

            const params = [`%${search}%`, `%${search}%`, ...limitParams];

            // nếu có limit thì $3 $4 mới tồn tại => ok do params nối vào sau
            const result = await pool.query(sql, params);
            return this.convertArrayToObjects(result.rows);
        } catch (error) {
            throw new Error(error.message);
        }
    };

    static getByStudentId = async (student_id, page = null, item_per_page = null) => {
        try {
            const { limit, params: limitParams } = this.buildLimit(page, item_per_page);

            const sql = `
        ${this.SELECT_ALL_QUERY}
        WHERE register.student_id = $1
        ${limit}
      `;

            const params = [student_id, ...limitParams];

            const result = await pool.query(sql, params);
            return this.convertArrayToObjects(result.rows);
        } catch (error) {
            throw new Error(error.message);
        }
    };

    static getBySubjectId = async (subject_id, page = null, item_per_page = null) => {
        try {
            const { limit, params: limitParams } = this.buildLimit(page, item_per_page);

            const sql = `
        ${this.SELECT_ALL_QUERY}
        WHERE register.subject_id = $1
        ${limit}
      `;

            const params = [subject_id, ...limitParams];

            const result = await pool.query(sql, params);
            return this.convertArrayToObjects(result.rows);
        } catch (error) {
            throw new Error(error.message);
        }
    };

    static save = async (data) => {
        try {
            const sql = `
        INSERT INTO register (student_id, subject_id, score)
        VALUES ($1, $2, $3)
        RETURNING id
      `;

            const result = await pool.query(sql, [data.student_id, data.subject_id, null]);
            return result.rows[0].id;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    static find = async (id) => {
        try {
            const result = await pool.query(
                `${this.SELECT_ALL_QUERY} WHERE register.id = $1`,
                [id]
            );

            if (result.rows.length === 0) return null;

            const registers = this.convertArrayToObjects(result.rows);
            return registers[0];
        } catch (error) {
            throw new Error(error.message);
        }
    };

    static fix = async (id, data) => {
        try {
            const result = await pool.query(
                `UPDATE register SET score = $1 WHERE id = $2`,
                [data.score, id]
            );
            return result.rowCount > 0;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    static destroy = async (id) => {
        try {
            const result = await pool.query(`DELETE FROM register WHERE id = $1`, [id]);
            return result.rowCount > 0;
        } catch (error) {
            throw new Error(error.message);
        }
    };
}

module.exports = Register;
