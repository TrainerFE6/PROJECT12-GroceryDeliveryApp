const express = require('express');
const AuthController = require('../controllers/AuthController');
const UserValidator = require('../validator/UserValidator');
const product_imageController = require('../controllers/Product_imageController');

const router = express.Router();
const auth = require('../middlewares/auth');

const controller = new product_imageController();

router.post('/create', auth(), controller.create);
router.get('/list', auth(), controller.list);
router.get('/read', auth(), controller.read);
router.post('/update', auth(), controller.update);
router.post('/delete', auth(), controller.delete);

module.exports = router;
