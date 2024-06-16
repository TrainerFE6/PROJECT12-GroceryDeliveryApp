const express = require('express');
const AuthController = require('../controllers/AuthController');
const UserValidator = require('../validator/UserValidator');
const CartController = require('../controllers/CartController');

const router = express.Router();
const auth = require('../middlewares/auth');

const controller = new CartController();

router.post('/upsert', auth('customers'), controller.upsert);
router.post('/update-quantity', auth('customers'), controller.updateQuantity);

router.post('/create', auth('customers'), controller.create);
router.get('/list', auth('customers'), controller.list);
router.get('/read', auth('customers'), controller.read);
router.post('/update', auth('customers'), controller.update);
router.post('/delete', auth('customers'), controller.delete);

module.exports = router;
