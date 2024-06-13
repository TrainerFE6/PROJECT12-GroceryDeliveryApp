const express = require('express');
const AuthController = require('../controllers/AuthController');
const UserValidator = require('../validator/UserValidator');
const CustomersController = require('../controllers/CustomersController');

const router = express.Router();
const auth = require('../middlewares/auth');
const Customers = require('../models/Customers');

const controller = new CustomersController();

router.post('/create', auth(), controller.create);
router.get('/list', auth(), controller.list);
router.get('/read', auth(), controller.read);
router.post('/update', auth(), controller.update);
router.post('/delete', auth(), controller.delete);

module.exports = router;
