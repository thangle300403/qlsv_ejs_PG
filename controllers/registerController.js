const registerModel = require('../model/registers');
const studentModel = require('../model/students');
const subjectModel = require('../model/subjects');
const { format } = require('date-fns');
class registerController {
    static module = 'register';
    //trả về view -> (req, res)
    static index = async (req, res) => {
        try {
            const search = req.query.search;
            const page = req.query.page || 1;
            const item_per_page = process.env.ITEM_PER_PAGE;
            const message_success = req.session.message_success;
            const message_error = req.session.message_error;
            let registers = [];
            let totalRegisters = [];

            delete req.session.message_success;
            delete req.session.message_error;

            if (search) {
                //dữ liệu đã phân trang
                registers = await registerModel.getByPatern(search, page, item_per_page);
                //dữ liệu ch phân trang
                totalRegisters = await registerModel.getByPatern(search);
            } else {
                //dữ liệu đã phân trang
                registers = await registerModel.all(page, item_per_page);
                //dữ liệu ch phân trang
                totalRegisters = await registerModel.all();
            }

            const totalPage = Math.ceil(totalRegisters.length / item_per_page);
            // console.log(registers);
            res.render('register/index', {
                registers: registers,
                format: format,
                search: search,
                message_success: message_success,
                message_error: message_error,
                totalPage: totalPage,
                page: page,
                module: this.module,
            });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    static create = async (req, res) => {
        try {
            const students = await studentModel.all();
            const subjects = await subjectModel.all();
            res.render('register/create', {
                module: this.module,
                students: students,
                subjects: subjects,
            });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    static store = async (req, res) => {
        try {
            await registerModel.save(req.body);

            const student = await studentModel.find(req.body.student_id);
            const student_name = student.name;

            const subject = await subjectModel.find(req.body.subject_id);
            const subject_name = subject.name;

            req.session.message_success = `Student ${student_name} regist subject ${subject_name} successful!`;
            console.log(req.session.message_success);
            res.redirect('/register');
        } catch (error) {
            req.session.message_error = `${error.message}`;
            res.redirect('/register');
        }
    }

    static edit = async (req, res) => {
        try {
            const register = await registerModel.find(req.params.id);

            res.render('register/edit', {
                register: register,
                module: this.module,
            });
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static update = async (req, res) => {
        try {
            const id = req.body.id;

            let score = req.body.score;

            const register = await registerModel.find(id);

            await registerModel.fix(id, {
                score: score,
            });

            console.log('điểm đã đc sửa', score);

            const student = await studentModel.find(register.student_id);
            const student_name = student ? student.name : '';

            const subject = await subjectModel.find(register.subject_id);
            const subject_name = subject ? subject.name : '';

            // Update session message for success
            req.session.message_success = `Student ${student_name} scored ${score} points in ${subject_name} exam!`;
            console.log(req.session.message_success);
            res.redirect('/register');
        } catch (error) {
            // res.status(500).send(error.message);
            req.session.message_error = `${error.message}`;
            res.redirect('/register');
        }
    }

    static destroy = async (req, res) => {
        try {
            const registerData = await registerModel.find(req.params.id);

            if (!registerData) {
                throw new Error('Register not found');
            }

            const destroyed = await registerModel.destroy(req.params.id);

            if (!destroyed) {
                throw new Error('Failed to delete register');
            }

            req.session.message_success = `Delete register ${registerData.student_id} successful!`;
            res.redirect('/register');
        } catch (error) {
            req.session.message_error = `${error.message}`;
            res.redirect('/register');
        }
    }
}
module.exports = registerController;