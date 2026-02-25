const pool = require("./db");

class Student {
    constructor(id, name, birthday, gender) {
        this.id = id;
        this.name = name;
        this.birthday = birthday;
        this.gender = gender;
    }

    static SELECT_ALL_QUERY = "SELECT * FROM student";

    static ORDER_BY = "ORDER BY id ASC";

    // Postgres: LIMIT <count> OFFSET <offset>
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


    // đồng bộ object với data
    static all = async (page = null, item_per_page = null) => {
        try {
            const { limit, params } = this.buildLimit(page, item_per_page);

            const result = await pool.query(`${this.SELECT_ALL_QUERY} ${this.ORDER_BY} ${limit}`, params);
            return this.convertArrayToObjects(result.rows);
        } catch (error) {
            throw new Error(error.message);
        }
    };

    static convertArrayToObjects = (rows) => {
        return rows.map((row) => new Student(row.id, row.name, row.birthday, row.gender));
    };

    static getByPatern = async (search, page = null, item_per_page = null) => {
        try {
            const { limit, params: limitParams } = this.buildLimit(page, item_per_page);

            const sql = `
        ${this.SELECT_ALL_QUERY}
        WHERE name ILIKE $1
        ${limit}
      `;

            let params = [`%${search}%`];

            // nếu có limit thì buildLimit trả [item_per_page, offset]
            if (limitParams.length > 0) {
                // lúc này $2 $3
                params = [...params, ...limitParams];
            }

            const result = await pool.query(sql, params);

            return this.convertArrayToObjects(result.rows);
        } catch (error) {
            throw new Error(error.message);
        }
    };

    static save = async (data) => {
        try {
            const sql = `
        INSERT INTO student (name, birthday, gender)
        VALUES ($1, $2, $3)
        RETURNING id
      `;

            const result = await pool.query(sql, [data.name, data.birthday, data.gender]);
            return result.rows[0].id;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    static find = async (id) => {
        try {
            const result = await pool.query(`${this.SELECT_ALL_QUERY} WHERE id = $1`, [id]);

            if (result.rows.length === 0) return null;

            const row = result.rows[0];

            const birthday = row.birthday
                ? new Date(row.birthday).toISOString().split("T")[0]
                : "";

            return new Student(row.id, row.name, birthday, row.gender);
        } catch (error) {
            throw new Error(error.message);
        }
    };

    static fix = async (id, data) => {
        try {
            const result = await pool.query(
                `UPDATE student SET name = $1, birthday = $2, gender = $3 WHERE id = $4`,
                [data.name, data.birthday, data.gender, id]
            );

            return result.rowCount > 0;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    // instance destroy
    destroy = async () => {
        try {
            const result = await pool.query(`DELETE FROM student WHERE id = $1`, [this.id]);
            return result.rowCount > 0;
        } catch (error) {
            throw new Error(error.message);
        }
    };
}

module.exports = Student;
