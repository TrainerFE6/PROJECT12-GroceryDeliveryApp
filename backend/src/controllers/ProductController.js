const httpStatus = require('http-status');
const logger = require('../config/logger');
const Joi = require('joi');
const { tokenTypes } = require('../config/tokens');
const {Product, Categories, ProductImage, TransactionDetail, Cart} = require('../models'); // Add this line to import the Slider model

class Controller {

    create = async (req, res) => {
        try {
            const schema = Joi.object({
                name: Joi.string().required(),
                category_id: Joi.number().required(),
                sku: Joi.string().required(),
                description: Joi.string().required(),
                min_order: Joi.number().required(),
                weight: Joi.string().required(),
                price: Joi.string().required(),
                stock: Joi.string().required(),
                // product_id: Joi.string().required(),
            }).unknown(true);

            await schema.validateAsync(req.body);
            console.log(req.body)
            const data = await Product.create(req.body);
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
            const where = {};
            if (req.query.category_id) {
                where.category_id = req.query.category_id;
            }
            const data = await Product.findAll({
                where: where,
                include: [
                    {
                        model: Categories,
                    },
                    {
                        model: ProductImage,
                    }
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
            const data = await Product.findOne({
                where: {
                    id: req.query.id
                },
                include: [
                    {
                        model: Categories,
                    },
                    {
                        model: ProductImage,
                    }
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

    update = async (req, res) => {
        try {
            const schema = Joi.object({
                id: Joi.number().required(),
                name: Joi.string().required(),
                category_id: Joi.string().required(),
                sku: Joi.string().required(),
                description: Joi.string().required(),
                min_order: Joi.number().required(),
                weight: Joi.string().required(),
                price: Joi.string().required(),
                stock: Joi.string().required(),
                // product_id: Joi.string().required(),
            }).unknown(true);

            await schema.validateAsync(req.body);
            const id = req.body.id;
            
            await Product.update(req.body, {
                where: {
                    id: id
                }
            });

            const data = await Product.findOne({
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
            const transaction = await TransactionDetail.findOne({
                where: {
                    product_id: req.body.id
                }
            });
            if (transaction) {
                res.status(httpStatus.BAD_REQUEST).send({
                    status: false,
                    message: 'Tidak dapat menghapus produk yang sudah terjual',
                });
                return;
            }

            const cart = await Cart.findOne({
                where: {
                    product_id: req.body.id
                }
            });

            if (cart) {
                res.status(httpStatus.BAD_REQUEST).send({
                    status: false,
                    message: 'Tidak dapat menghapus produk yang sudah ada di keranjang',
                });
                return;
            }

            const data = await Product.destroy({
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
