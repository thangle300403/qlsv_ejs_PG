const pool = require('./db');

class student {
    constructor(id, name, birthday, gender) {
        this.id = id;
        this.name = name;
        this.birthday = birthday;
        this.gender = gender;
    }

    static SELECT_ALL_QUERY = 'select * from student';

    static buildLimit = (page = null, item_per_page = null) => {

        let limit = '';
        if (page && item_per_page) {
            const row_index = (page - 1) * item_per_page;
            limit = `LIMIT ${row_index}, ${item_per_page}`;
        }
        return limit;
    }

    //đồng bộ object với data
    static all = async (page = null, item_per_page = null) => {

        try {
            //xây dựng phân trang
            const limit = this.buildLimit(page, item_per_page);
            const [rows] = await pool.execute(`${this.SELECT_ALL_QUERY} ${limit}`);
            return student.convertArrayToObjects(rows);
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    }

    static convertArrayToObjects = async (rows) => {
        const students = rows.map(row => new student(row.id, row.name, row.birthday, row.gender));
        return students;
    }

    static getByPatern = async (search, page = null, item_per_page = null) => {
        try {
            //xây dựng phân trang
            const limit = this.buildLimit(page, item_per_page);
            const [rows] = await pool.execute(`${this.SELECT_ALL_QUERY} where name like ? ${limit}`, [`%${search}%`]);
            return student.convertArrayToObjects(rows);
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    }

    static save = async (data) => {
        try {
            const [row] = await pool.execute('insert into student value(?, ?, ?, ?)', [null, data.name, data.birthday, data.gender]);
            return row.insertId;
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    }

    static find = async (id) => {
        try {
            const [rows] = await pool.execute(`${this.SELECT_ALL_QUERY} where id = ?`, [id]);
            if (rows.length === 0) {
                return null;
            }
            const student = rows[0];
            return student;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }

    static fix = async (id, data) => {
        try {
            const result = await pool.execute('UPDATE student SET name = ?, birthday = ?, gender = ? WHERE id = ?', [data.name, data.birthday, data.gender, id]);
            return result[0].affectedRows > 0;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }

    destroy = async () => {
        try {
            await pool.execute('DELETE FROM student WHERE id = ?', [this.id]);
            return true;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = student;