const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');

router.get('/', subjectController.index);

router.get('/create', subjectController.create);

router.post('/store', subjectController.store);

router.get('/edit/:id', subjectController.edit);

router.post('/update', subjectController.update);

router.get('/destroy/:id', subjectController.destroy);

module.exports = router;