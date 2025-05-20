const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');

router.get('/', registerController.index);

router.get('/create', registerController.create);

router.post('/store', registerController.store);

router.get('/edit/:id', registerController.edit);

router.post('/update', registerController.update);

router.get('/destroy/:id', registerController.destroy);

module.exports = router;