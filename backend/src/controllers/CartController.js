const httpStatus = require('http-status');
const logger = require('../config/logger');
const Joi = require('joi');
const { tokenTypes } = require('../config/tokens');
const {Cart,Product,ProductImage} = require('../models'); // Add this line to import the Slider model
const { Op } = require('sequelize');

class Controller {

    upsert = async (req, res) => {
        try {
            const schema = Joi.object({
                product_id: Joi.number().required(),
                quantity: Joi.number().required(),
                price: Joi.string().required(),
            }).unknown(true);

            await schema.validateAsync(req.body);
            
            const price = parseFloat(req.body.price);

            const cek = await Cart.findOne({
                where: {
                    customer_id: req.user.id,
                    product_id: req.body.product_id
                }
            });

            if (cek) {
                await Cart.update({
                    quantity: parseFloat(req.body.quantity) + 1,
                    price: price,
                    subtotal: price * parseFloat(req.body.quantity + 1),
                }, {
                    where: {
                        customer_id: req.user.id,
                        product_id: req.body.product_id
                    }
                });
            } else {
                await Cart.create({
                    customer_id: req.user.id,
                    product_id: req.body.product_id,
                    quantity: req.body.quantity,
                    price: price,
                    subtotal: price * parseFloat(req.body.quantity),
                });
            }

            res.status(httpStatus.OK).send({
                status: true,
                message: 'Success',
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_REQUEST).send(e);
        }
    };

    updateQuantity = async (req, res) => {
        try {
            const schema = Joi.object({
                id: Joi.number().required(),
                quantity: Joi.number().required(),
            }).unknown(true);

            await schema.validateAsync(req.body);

            const cart = await Cart.findOne({
                where: {
                    id: req.body.id
                }
            });

            const price = parseFloat(cart.price);

            await Cart.update({
                quantity: req.body.quantity,
                subtotal: price * req.body.quantity,
            }, {
                where: {
                    id: req.body.id
                }
            });

            res.status(httpStatus.OK).send({
                status: true,
                message: 'Success',
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_REQUEST).send(e);
        }
    };

    create = async (req, res) => {
        try {
            const schema = Joi.object({
                customer_id: Joi.string().required(),
                product_id: Joi.string().required(),
                // note: Joi.string().required(),
                quantity: Joi.string().required(),
                price: Joi.string().required(),
                sub_total: Joi.string().required(),
                // product_id: Joi.string().required(),
            }).unknown(true);

            await schema.validateAsync(req.body);
            console.log(req.body)
            const data = await Cart.create(req.body);
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
            console.log('userccccc', req.user.dataValues)
            const data = await Cart.findAll({
                include: [
                    {
                        model: Product,
                        attributes: ['id', 'name', 'price', 'stock'],
                        include: [
                            {
                                model: ProductImage,
                                attributes: ['id', 'path'],
                            }
                        ]
                    }
                ],
                where: {
                    customer_id: req.user.dataValues.id,
                    '$Product.id$': { [Op.ne]: null }
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

    read = async (req, res) => {
        try {
            console.log('cok', req)
            const data = await Cart.findOne({
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
                customer_id: Joi.string().required(),
                product_id: Joi.string().required(),
                note: Joi.string().required(),
                quantity: Joi.string().required(),
                price: Joi.string().required(),
                sub_total: Joi.string().required(),
                // product_id: Joi.string().required(),
            }).unknown(true);

            await schema.validateAsync(req.body);
            const id = req.body.id;
            
            await Cart.update(req.body, {
                where: {
                    id: id
                }
            });

            const data = await Cart.findOne({
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
            const data = await Cart.destroy({
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
