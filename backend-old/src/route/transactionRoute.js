const express = require('express');
const AuthController = require('../controllers/AuthController');
const UserValidator = require('../validator/UserValidator');
const TransactionController = require('../controllers/TransactionController');

const router = express.Router();
const auth = require('../middlewares/auth');

const controller = new TransactionController();

router.post('/create', auth('customers'), controller.create);
router.get('/list', auth(), controller.list);
router.get('/read', auth(), controller.read);
router.post('/update/shipping-receipt', auth(), controller.updateShippingReceipt);
router.post('/update/payment-status', auth(), controller.updatePaymentStatus);

router.get('/landing/list', auth('customers'), controller.listCustomer);
router.get('/landing/read', auth('customers'), controller.read);
module.exports = router;
