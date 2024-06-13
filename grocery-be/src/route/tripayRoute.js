const express = require('express');
const AuthController = require('../controllers/AuthController');
const UserValidator = require('../validator/UserValidator');
const TripayController = require('../controllers/TripayController');

const router = express.Router();
const auth = require('../middlewares/auth');

const controller = new TripayController();

router.post('/sync-payment', auth(), controller.syncPayment);
router.post('/get-payment', auth('customers'), controller.getPayment);
router.post('/callback', controller.callback);
module.exports = router;
