const httpStatus = require('http-status');
const logger = require('../config/logger');
const Joi = require('joi');
const { tokenTypes } = require('../config/tokens');
const {Customers,Categories,Provinces,Cities, Transaction} = require('../models'); // Add this line to import the Slider model
const bcrypt = require('bcryptjs');

class Controller {

    create = async (req, res) => {
        try {
            const schema = Joi.object({
                name: Joi.string().required(),
                email: Joi.string().required(),
                phone_number: Joi.string().required(),
                province_id: Joi.string().required(),
                city_id: Joi.string().required(),
                address: Joi.string().required(),
                password: Joi.string().required(),
            }).unknown(true);

            await schema.validateAsync(req.body);
            console.log(req.body)
            const payload = {
                ...req.body,
                password: bcrypt.hashSync(req.body.password, 8)
            }
            console.log (payload)
            const data = await Customers.create(payload);
            res.status(httpStatus.OK).send({
                status: true,
                message: 'Success',
                data: data,
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_REQUEST).send(e);
        }
    };

    list = async (req, res) => {
        try {
            const data = await Customers.findAll({
                include: [
                    {
                        model: Provinces,
                    },
                    {
                        model: Cities,
                    },
                ]
            });
            res.status(httpStatus.OK).send({
                status: true,
                message: 'Success',
                data: data,
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_REQUEST).send(e);
        }
    };

    read = async (req, res) => {
        try {
            console.log('cok', req)
            const data = await Customers.findOne({
                where: {
                    id: req.query.id
                }
            });
            res.status(httpStatus.OK).send({
                status: true,
                message: 'Success',
                data: data,
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_REQUEST).send(e);
        }
    };

    update = async (req, res) => {
        try {
            const schema = Joi.object({
                id: Joi.number().required(),
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
                    id: id
                }
            });

            const data = await Customers.findOne({
                where: {
                    id: id
                }
            });

            res.status(httpStatus.OK).send({
                status: true,
                message: 'Success',
                data: data,
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_REQUEST).send(e);
        }
    };

    delete = async (req, res) => {
        try {
            const pr = await Transaction.findOne({
                where: {
                    customer_id: req.body.id
                }
            });
            if (pr) {
                res.status(httpStatus.BAD_REQUEST).send({
                    status: false,
                    message: 'Tidak bisa menghapus pelanggan yang pernah melakukan order',
                });
                return;
            }

            const data = await Customers.destroy({
                where: {
                    id: req.body.id
                }
            });
            res.status(httpStatus.OK).send({
                status: true,
                message: 'Success',
                data: data,
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_REQUEST).send(e);
        }
    };
    
}

module.exports = Controller;
