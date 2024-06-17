const express = require('express');
const AuthController = require('../controllers/AuthController');
const UserValidator = require('../validator/UserValidator');
const StatisticController = require('../controllers/StatisticController');

const router = express.Router();
const auth = require('../middlewares/auth');

const controller = new StatisticController();

router.get('/revenue', auth(), controller.revenue);

module.exports = router;
