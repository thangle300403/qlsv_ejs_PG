const studentModel = require('../model/students');
const registerModel = require('../model/registers');
const { format } = require('date-fns');
class studentController {
    static module = 'student';
    //trả về view -> (req, res)
    static index = async (req, res) => {
        try {
            const search = req.query.search;
            const page = Number(req.query.page || 1);
            const item_per_page = process.env.ITEM_PER_PAGE;
            const message_success = req.session.message_success;
            const message_error = req.session.message_error;
            let students = [];
            let totalStudents = [];

            delete req.session.message_success;
            delete req.session.message_error;

            if (search) {
                //dữ liệu đã phân trang
                students = await studentModel.getByPatern(search, page, item_per_page);
                //dữ liệu ch phân trang
                totalStudents = await studentModel.getByPatern(search);
            } else {
                //dữ liệu đã phân trang
                students = await studentModel.all(page, item_per_page);
                //dữ liệu ch phân trang
                totalStudents = await studentModel.all();
            }

            const totalPage = Math.ceil(totalStudents.length / item_per_page);
            // console.log(students);
            res.render('student/index', {
                students: students,
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

    static create = (req, res) => {
        try {
            res.render('student/create', {
                module: this.module,
            });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    static store = (req, res) => {
        try {
            studentModel.save(req.body);
            req.session.message_success = `Create student ${req.body.name} successs.`;
            console.log(req.session.message_success);
            res.redirect('/');
        } catch (error) {
            req.session.message_error = `${error.message}`;
            res.redirect('/');
        }
    }

    static edit = async (req, res) => {
        try {
            const student = await studentModel.find(req.params.id);
            console.log(student);
            res.render('student/edit', {
                student: student,
                module: this.module,
            });
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static update = async (req, res) => {
        try {
            const id = req.body.id;

            await studentModel.fix(id, {
                name: req.body.name,
                birthday: req.body.birthday,
                gender: req.body.gender
            });

            // Update session message for success
            req.session.message_success = `Edit student ${req.body.name} successful!`;
            console.log(req.session.message_success)
            res.redirect('/');
        } catch (error) {
            // res.status(500).send(error.message);
            req.session.message_error = `${error.message}`;
            res.redirect('/');
        }
    }

    static destroy = async (req, res) => {
        try {
            const studentData = await studentModel.find(req.params.id);

            //kiểm tra sv đã đki môn học ch ? nếu đki r thì k thể xóa
            //lấy danh sách register của sv cần xóa
            const registers = await registerModel.getByStudentId(req.params.id);
            if (registers.length > 0) {
                req.session.message_error = `Student ${studentData.name} has registed ${registers.length} subjects, unable to delete.`;
                res.redirect('/');
                return;
            }

            if (!studentData) {
                throw new Error('Student not found');
            }

            const student = new studentModel(studentData.id, studentData.name, studentData.birthday, studentData.gender);

            await student.destroy();

            // Update session message for success
            req.session.message_success = `Delete student ${studentData.name} successful!`;
            res.redirect('/');
        } catch (error) {
            req.session.message_error = `${error.message}`;
            res.redirect('/');
        }
    }
}
module.exports = studentController;