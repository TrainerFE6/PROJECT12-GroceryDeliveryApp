const express = require('express');
const AuthController = require('../controllers/AuthController');
const UserValidator = require('../validator/UserValidator');
const SliderController = require('../controllers/SliderController');

const router = express.Router();
const auth = require('../middlewares/auth');

const controller = new SliderController();

router.post('/create', auth(), controller.create);
router.get('/list', auth(), controller.list);
router.get('/read', auth(), controller.read);
router.post('/update', auth(), controller.update);
router.post('/delete', auth(), controller.delete);

module.exports = router;
