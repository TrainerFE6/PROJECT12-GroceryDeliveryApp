const express = require('express');
const AuthController = require('../controllers/AuthController');
const UserValidator = require('../validator/UserValidator');
const RajaOngkirController = require('../controllers/RajaOngkirController');

const router = express.Router();
const auth = require('../middlewares/auth');

const controller = new RajaOngkirController();

router.get('/provinces', controller.provinces);
router.get('/cities', controller.cities);
router.post('/cost', controller.cost);

module.exports = router;
