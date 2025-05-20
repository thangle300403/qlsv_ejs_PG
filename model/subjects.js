const pool = require('./db');

class subject {
    constructor(id, name, number_of_credit) {
        this.id = id;
        this.name = name;
        this.number_of_credit = number_of_credit;
    }

    static SELECT_ALL_QUERY = 'select * from subject';

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
            return subject.convertArrayToObjects(rows);
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    }

    static convertArrayToObjects = async (rows) => {
        const subjects = rows.map(row => new subject(row.id, row.name, row.number_of_credit));
        return subjects;
    }

    static getByPatern = async (search, page = null, item_per_page = null) => {
        try {
            //xây dựng phân trang
            const limit = this.buildLimit(page, item_per_page);
            const [rows] = await pool.execute(`${this.SELECT_ALL_QUERY} where name like ? ${limit}`, [`%${search}%`]);
            return subject.convertArrayToObjects(rows);
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    }

    static save = async (data) => {
        try {
            const [row] = await pool.execute('insert into subject value(?, ?, ?)', [null, data.name, data.number_of_credit]);
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
            const subject = rows[0];
            return subject;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }

    static fix = async (id, data) => {
        try {
            const result = await pool.execute('UPDATE subject SET name = ?, number_of_credit = ? WHERE id = ?', [data.name, data.number_of_credit, id]);
            return result[0].affectedRows > 0;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    destroy = async () => {
        try {
            await pool.execute('DELETE FROM subject WHERE id = ?', [this.id]);
            return true;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = subject;