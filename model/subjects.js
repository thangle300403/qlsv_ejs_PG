const pool = require('./db');

class subject {
    constructor(id, name, number_of_credit) {
        this.id = id;
        this.name = name;
        this.number_of_credit = number_of_credit;
    }

    static SELECT_ALL_QUERY = 'select * from subject';
    static ORDER_BY = "ORDER BY id ASC";

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

    //đồng bộ object với data

    static all = async (page = null, item_per_page = null) => {
        try {
            const { limit, params } = this.buildLimit(page, item_per_page);

            const result = await pool.query(`${this.SELECT_ALL_QUERY} ${this.ORDER_BY} ${limit}`, params);
            return this.convertArrayToObjects(result.rows);
        } catch (error) {
            throw new Error(error.message);
        }
    };

    static convertArrayToObjects = async (rows) => {
        const subjects = rows.map(row => new subject(row.id, row.name, row.number_of_credit));
        return subjects;
    }

    static getByPatern = async (search, page = null, item_per_page = null) => {
        try {
            //xây dựng phân trang
            const { limit, params: limitParams } = this.buildLimit(page, item_per_page, 2);
            const params = [`%${search}%`, ...limitParams];
            const result = await pool.query(` ${this.SELECT_ALL_QUERY}
        WHERE name ILIKE $1
        ${this.ORDER_BY}
        ${limit}`, params);
            return this.convertArrayToObjects(result.rows);

        }
        catch (error) {
            throw new Error(error.message);
        }
    }

    static save = async (data) => {
        try {
            const sql = `
        INSERT INTO subject (name, number_of_credit)
        VALUES ($1, $2)
        RETURNING id
      `;

            const result = await pool.query(sql, [data.name, data.number_of_credit]);
            return result.rows[0].id;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    static find = async (id) => {
        try {
            const result = await pool.query(`${this.SELECT_ALL_QUERY} where id = $1`, [id]);
            if (result.rows.length === 0) {
                return null;
            }
            const row = result.rows[0];
            return new subject(row.id, row.name, row.number_of_credit);
        }
        catch (error) {
            throw new Error(error.message);
        }
    }

    static fix = async (id, data) => {
        try {
            const result = await pool.query(
                `UPDATE subject SET name = $1, number_of_credit = $2 WHERE id = $3`,
                [data.name, data.number_of_credit, id]
            );
            return result.rowCount > 0;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    destroy = async () => {
        try {
            const result = await pool.query(`DELETE FROM subject WHERE id = $1`, [this.id]);
            return result.rowCount > 0;
        } catch (error) {
            throw new Error(error.message);
        }
    };
}

module.exports = subject;