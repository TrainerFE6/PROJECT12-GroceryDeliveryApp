const express = require('express');
const AuthController = require('../controllers/AuthController');
const UserValidator = require('../validator/UserValidator');
const CategoriesController = require('../controllers/CategoriesController');

const router = express.Router();
const auth = require('../middlewares/auth');
const Categories = require('../models/Categories');

const controller = new CategoriesController();

router.post('/create', auth(), controller.create);
router.get('/list', auth(), controller.list);
router.get('/read', auth(), controller.read);
router.post('/update', auth(), controller.update);
router.post('/delete', auth(), controller.delete);

router.get('/landing/list', controller.list);

module.exports = router;
