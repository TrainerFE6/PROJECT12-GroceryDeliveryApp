const httpStatus = require('http-status');
const AuthCustomerService = require('../service/AuthCustomerService');
const TokenService = require('../service/TokenService');
const UserService = require('../service/UserService');
const logger = require('../config/logger');
const { tokenTypes } = require('../config/tokens');
const Joi = require('joi');
const { Customers } = require('../models');
const bcrypt = require('bcryptjs');

class AuthCustomersController {
    constructor() {
        this.userService = new UserService();
        this.tokenService = new TokenService();
        this.authCustomerService = new AuthCustomerService();
    }

    me = async (req, res) => {
        console.log('tol');
        try {
            const user = await this.userService.getUserByUuid(req.user.uuid);
            delete user.dataValues.password;
            res.status(httpStatus.OK).send({
                status: true,
                message: 'User Profile',
                data: user,
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    register = async (req, res) => {
        try {
            const schema = Joi.object({
                name: Joi.string().required().messages({
                    'any.required': 'Nama harus diisi',
                }),
                email: Joi.string().required().messages({
                    'any.required': 'Email harus diisi',
                }),
                phone_number: Joi.string().required().messages({
                    'any.required': 'Nomor telepon harus diisi',
                }),
                province_id: Joi.string().required().messages({
                    'any.required': 'ID provinsi harus diisi',
                }),
                city_id: Joi.string().required().messages({
                    'any.required': 'ID kota harus diisi',
                }),
                address: Joi.string().required().messages({
                    'any.required': 'Alamat harus diisi',
                }),
                password: Joi.string()
                    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
                    .required().messages({
                        'any.required': 'Password harus diisi',
                        'string.pattern.base': 'Password harus terdiri dari setidaknya 8 karakter, termasuk setidaknya satu huruf kecil, satu huruf besar, satu angka, dan satu simbol khusus',
                    })
            }).unknown(true);

            await schema.validateAsync(req.body);

            const isEmailExists = await this.userService.isEmailExists(req.body.email);
            if (!isEmailExists) {
                return res.status(httpStatus.BAD_REQUEST).send('Email already exists');
            }

            const payload = {
                ...req.body,
                password: bcrypt.hashSync(req.body.password, 8)
            }

            const data = await Customers.create(payload);

            res.status(httpStatus.OK).send({ message: 'Berhasil', data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    checkEmail = async (req, res) => {
        try {
            const isExists = await this.userService.isEmailExists(req.body.email.toLowerCase());
            res.status(isExists.statusCode).send(isExists.response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    login = async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await this.authCustomerService.loginWithEmailPassword(
                email.toLowerCase(),
                password,
            );
            const { message } = user.response;
            const { data } = user.response;
            const { status } = user.response;
            const code = user.statusCode;
            let tokens = {};
            if (user.response.status) {
                console.log(data);
                tokens = await this.tokenService.generateAuthTokens({ ...data, uuid: data.id });
            }
            res.status(user.statusCode).send({ status, code, message, data, tokens });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    logout = async (req, res) => {
        await this.authCustomerService.logout(req, res);
        res.status(httpStatus.NO_CONTENT).send();
    };

    refreshTokens = async (req, res) => {
        try {
            const refreshTokenDoc = await this.tokenService.verifyToken(
                req.body.refresh_token,
                tokenTypes.REFRESH,
            );
            const user = await this.userService.getUserByUuid(refreshTokenDoc.user_uuid);
            if (user == null) {
                res.status(httpStatus.BAD_GATEWAY).send('User Not Found!');
            }
            await this.tokenService.removeTokenById(refreshTokenDoc.id);
            const tokens = await this.tokenService.generateAuthTokens(user);
            res.send(tokens);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    changePassword = async (req, res) => {
        try {
            const responseData = await this.userService.changePassword(req.body, req.user.uuid);
            res.status(responseData.statusCode).send(responseData.response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    updateProfile = async (req, res) => {
        try {
            // console.log(req.user);
            const schema = Joi.object({
                // id: Joi.number().required(),
                name: Joi.string().required(),
                email: Joi.string().required(),
                phone_number: Joi.string().required(),
                province_id: Joi.string().required(),
                city_id: Joi.string().required(),
                address: Joi.string().required(),
                // password: Joi.string().required(),
            }).unknown(true);

            await schema.validateAsync(req.body);
            const id = req.body.id;
            
            const payload = { ...req.body };
            if (req.body.password) {
                payload.password = bcrypt.hashSync(req.body.password, 8);
            }

            await Customers.update(payload, {
                where: {
                    id: req.user.id
                }
            });

            const data = await Customers.findOne({
                where: {
                    id: req.user.id
                }
            });
            delete data.dataValues.password;
            res.status(httpStatus.OK).send({
                status: true,
                message: 'Success',
                data: data,
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_REQUEST).send(e);
        }
    }
}

module.exports = AuthCustomersController;
