const express = require('express');
const AuthCustomersController = require('../controllers/AuthCustomersController');
const UserValidator = require('../validator/UserValidator');

const router = express.Router();
const auth = require('../middlewares/auth');

const authCustomerController = new AuthCustomersController();
const userValidator = new UserValidator();

router.post('/email-exists', userValidator.checkEmailValidator, authCustomerController.checkEmail);
router.post('/login', userValidator.userLoginValidator, authCustomerController.login);
router.post('/refresh-token', authCustomerController.refreshTokens);
router.post('/logout', authCustomerController.logout);
router.put(
    '/change-password',
    auth(),
    userValidator.changePasswordValidator,
    authCustomerController.changePassword,
);

router.get('/me', auth('customers'), authCustomerController.me);
router.post('/update-profile', auth('customers'), authCustomerController.updateProfile);
router.post('/register', authCustomerController.register);

module.exports = router;
