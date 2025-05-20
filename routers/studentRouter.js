const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.get('/', studentController.index);

router.get('/create', studentController.create);

router.post('/store', studentController.store);

router.get('/edit/:id', studentController.edit);

router.post('/update', studentController.update);

router.get('/destroy/:id', studentController.destroy);

module.exports = router;