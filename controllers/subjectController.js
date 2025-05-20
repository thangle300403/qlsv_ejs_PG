const subjectModel = require('../model/subjects');
const registerModel = require('../model/registers');
const { format } = require('date-fns');
class subjectController {
    static module = 'subject';
    //trả về view -> (req, res)
    static index = async (req, res) => {
        try {
            const search = req.query.search;
            const page = req.query.page || 1;
            const item_per_page = process.env.ITEM_PER_PAGE;
            const message_success = req.session.message_success;
            const message_error = req.session.message_error;
            let subjects = [];
            let totalSubjects = [];

            delete req.session.message_success;
            delete req.session.message_error;

            if (search) {
                //dữ liệu đã phân trang
                subjects = await subjectModel.getByPatern(search, page, item_per_page);
                //dữ liệu ch phân trang
                totalSubjects = await subjectModel.getByPatern(search);
            } else {
                //dữ liệu đã phân trang
                subjects = await subjectModel.all(page, item_per_page);
                //dữ liệu ch phân trang
                totalSubjects = await subjectModel.all();
            }

            const totalPage = Math.ceil(totalSubjects.length / item_per_page);
            // console.log(subjects);
            res.render('subject/index', {
                subjects: subjects,
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
            res.render('subject/create', {
                module: this.module,
            });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    static store = async (req, res) => {
        try {
            await subjectModel.save(req.body);
            req.session.message_success = `Create subject ${req.body.name} successs.`;
            console.log(req.session.message_success);
            res.redirect('/subject');
        } catch (error) {
            req.session.message_error = `${error.message}`;
            res.redirect('/subject');
        }
    }

    static edit = async (req, res) => {
        try {
            const subject = await subjectModel.find(req.params.id);
            console.log(subject);
            res.render('subject/edit', {
                subject: subject,
                module: this.module,
            });
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static update = async (req, res) => {
        try {
            const id = req.body.id;

            await subjectModel.fix(id, {
                name: req.body.name,
                number_of_credit: req.body.number_of_credit,
            });

            // Update session message for success
            req.session.message_success = `Edit subject ${req.body.name} successful!`;
            console.log(req.session.message_success)
            res.redirect('/subject');
        } catch (error) {
            // res.status(500).send(error.message);
            req.session.message_error = `${error.message}`;
            res.redirect('/subject');
        }
    }

    static destroy = async (req, res) => {
        try {
            const subjectData = await subjectModel.find(req.params.id);

            const registers = await registerModel.getBySubjectId(req.params.id);
            if (registers.length > 0) {
                req.session.message_error = `Subject ${subjectData.name} has been registed by ${registers.length} students, unable to delete.`;
                res.redirect('/');
                return;
            }

            if (!subjectData) {
                throw new Error('Subject not found');
            }

            const subject = new subjectModel(subjectData.id, subjectData.name, subjectData.number_of_credit);

            await subject.destroy();

            req.session.message_success = `Delete subject ${subjectData.name} successful!`;
            res.redirect('/subject');
        } catch (error) {
            req.session.message_error = `${error.message}`;
            res.redirect('/subject');
        }
    }
}
module.exports = subjectController;