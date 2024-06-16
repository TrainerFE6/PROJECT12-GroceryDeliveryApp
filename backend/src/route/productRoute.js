const express = require('express');
const AuthController = require('../controllers/AuthController');
const UserValidator = require('../validator/UserValidator');
const ProductController = require('../controllers/ProductController');

const router = express.Router();
const auth = require('../middlewares/auth');

const controller = new ProductController();

router.post('/create', auth(), controller.create);
router.get('/list', auth(), controller.list);
router.get('/read', auth(), controller.read);
router.post('/update', auth(), controller.update);
router.post('/delete', auth(), controller.delete);

router.get('/landing/list', controller.list);
router.get('/landing/read', controller.read);

module.exports = router;
