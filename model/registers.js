const pool = require('./db');

class Register {
    constructor(id, student_id, subject_id, score, student_name, subject_name) {
        this.id = id;
        this.student_id = student_id;
        this.subject_id = subject_id;
        this.score = score;
        this.student_name = student_name;
        this.subject_name = subject_name;
    }

    static SELECT_ALL_QUERY =
        `SELECT register.*, student.name as student_name, subject.name as subject_name 
         FROM register
         JOIN student ON register.student_id = student.id
         JOIN subject ON register.subject_id = subject.id`;

    static buildLimit = (page = null, item_per_page = null) => {
        let limit = '';
        if (page && item_per_page) {
            const row_index = (page - 1) * item_per_page;
            limit = `LIMIT ${row_index}, ${item_per_page}`;
        }
        return limit;
    }

    static all = async (page = null, item_per_page = null) => {
        try {
            const limit = this.buildLimit(page, item_per_page);
            const [rows] = await pool.execute(`${this.SELECT_ALL_QUERY} ${limit}`);
            return this.convertArrayToObjects(rows);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static convertArrayToObjects = rows => {
        return rows.map(row => new Register(row.id, row.student_id, row.subject_id, row.score != null ? row.score.toFixed(2) : null, row.student_name, row.subject_name));
    }

    static getByPattern = async (search, page = null, item_per_page = null) => {
        try {
            const limit = this.buildLimit(page, item_per_page);
            const [rows] = await pool.execute(`${this.SELECT_ALL_QUERY} WHERE student_id LIKE ? OR subject.name LIKE ? ${limit}`, [`%${search}%`, `%${search}%`]);
            return this.convertArrayToObjects(rows);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static getByStudentId = async (student_id, page = null, item_per_page = null) => {
        try {
            const limit = this.buildLimit(page, item_per_page);
            const [rows] = await pool.execute(`${this.SELECT_ALL_QUERY} WHERE register.student_id = ? ${limit}`, [student_id]);
            return this.convertArrayToObjects(rows);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static getBySubjectId = async (subject_id, page = null, item_per_page = null) => {
        try {
            const limit = this.buildLimit(page, item_per_page);
            const [rows] = await pool.execute(`${this.SELECT_ALL_QUERY} WHERE register.subject_id = ? ${limit}`, [subject_id]);
            return this.convertArrayToObjects(rows);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static save = async (data) => {
        try {
            const [row] = await pool.execute('INSERT INTO register VALUES (?, ?, ?, ?)', [null, data.student_id, data.subject_id, null]);
            return row.insertId;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static find = async (id) => {
        try {
            const [rows] = await pool.execute(`${this.SELECT_ALL_QUERY} WHERE register.id = ?`, [id]);
            if (rows.length === 0) {
                return null;
            }
            const registers = this.convertArrayToObjects(rows);
            const register = registers[0];
            return register;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static fix = async (id, data) => {
        try {
            const result = await pool.execute('UPDATE register SET score = ? WHERE id = ?', [data.score, id]);
            return result[0].affectedRows > 0;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static destroy = async (id) => {
        try {
            const result = await pool.execute('DELETE FROM register WHERE id = ?', [id]);
            return result[0].affectedRows > 0;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = Register;
