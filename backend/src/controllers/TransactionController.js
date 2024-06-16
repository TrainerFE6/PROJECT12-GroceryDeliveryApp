const httpStatus = require('http-status');
const AuthCustomerService = require('../service/AuthCustomerService');
const TokenService = require('../service/TokenService');
const UserService = require('../service/UserService');
const logger = require('../config/logger');
const { tokenTypes } = require('../config/tokens');
const { Provinces, Cities } = require('../models');
const request = require("request");
const { default: axios } = require('axios');
const config = require('../config/config');
const crypto = require('crypto')
const { sequelize, PaymentMethod, Transaction, TransactionDetail, Customers, Cart, Product } = require('../models');
const TransactionService = require('../service/TransactionService');
const Joi = require('joi');

class Controller {
    constructor() {
        this.tripay = new TransactionService();
    }

    create = async (req, res) => {
        const { payment_method_id, shipping_code, shipping_service, product_price, shipping_price, payment_price, total_price, carts, additional } = req.body;
        const t = await sequelize.transaction();

        try {
            const schema = Joi.object({
                payment_method_id: Joi.number().required(),
                shipping_code: Joi.string().valid('jne').required(), // JNE
                shipping_service: Joi.string().required(),
                product_price: Joi.number().required(),
                shipping_price: Joi.number().required(),
                payment_price: Joi.number().required(),
                total_price: Joi.number().required(),
                carts: Joi.array().items(Joi.object()).required(),
                additional: Joi.array()
            }).unknown(true);
            await schema.validateAsync(req.body);

            const payment_method = await PaymentMethod.findByPk(payment_method_id);
            if (!payment_method) {
                throw new Error('Payment Method Not Found');
            }

            const customer = await Customers.findByPk(req.user.id);
            if (!customer) {
                throw new Error('Customer Not Found');
            }

            const tripay = await this.tripay.reqTransaction(customer, payment_method.code, total_price, [ ...carts, ...additional ]);
            if(!tripay) {
                throw new Error('Failed To Make Payment');
            }

            console.log('result tripay', tripay);
            const transaction = await Transaction.create({
                customer_id: req.user.id,
                payment_method_id: payment_method_id,
                date: new Date(),
                invoice_number: tripay.merchant_ref,
                shipping_code: shipping_code,
                shipping_receipt: '',
                shipping_service: shipping_service,
                product_price: product_price,
                shipping_price: shipping_price,
                total_price: total_price,
                payment_price,
                payment_reference: tripay.reference,
                payment_status: 'UNPAID',
                payment_expire_time: 0,
                payment_instruction: '-',
            }, { transaction: t });

            const details = carts.map(item => {
                return {
                    transaction_id: transaction.id,
                    // product_sku: item.sku,
                    product_id: item.product_id,
                    price: item.price,
                    quantity: item.quantity,
                    subtotal: parseFloat(item.price) * parseFloat(item.quantity),
                };
            });

            await Cart.destroy({ where: { customer_id: req.user.id }, transaction: t });

            await TransactionDetail.bulkCreate(details, { transaction: t });


            await t.commit();

            res.status(httpStatus.OK).send({
                message: 'Transaction Create',
                data: transaction,
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    list = async (req, res) => {
        try {
            const where = {};
            console.log('role', req.user.role)
            if (req.user.role === 'customers') {
                where.customer_id = req.user.id;
            }
            const data = await Transaction.findAll({
                where: where,
                include: [
                    {
                        model: TransactionDetail,
                    },
                    {
                        model: PaymentMethod,
                    },
                    {
                        model: Customers,
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

    listCustomer = async (req, res) => {
        try {
            const where = {};
            where.customer_id = req.user.id;
            
            const data = await Transaction.findAll({
                where: where,
                include: [
                    {
                        model: TransactionDetail,
                    },
                    {
                        model: PaymentMethod,
                    },
                    {
                        model: Customers,
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
            const id = req.query.id;
            const where = {};
            where.id = id;
            if (req.user.role === 'customers') {
                where.customer_id = req.user.id;
            }
            const data = await Transaction.findOne({
                where: {
                    id: id
                },
                include: [
                    {
                        model: TransactionDetail,
                        include: [
                            {
                                model: Product
                            }
                        ]
                    },
                    {
                        model: PaymentMethod,
                    },
                    {
                        model: Customers,
                        include: [
                            {
                                model: Provinces,
                            },
                            {
                                model: Cities,
                            }
                        ]
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
    }

    update = async (req, res) => {
        try {
            const schema = Joi.object({
                id: Joi.number().required(),
            }).unknown(true);

            await schema.validateAsync(req.body);
            const id = req.body.id;
            
            await Transaction.update(req.body, {
                where: {
                    id: id
                }
            });

            const data = await Transaction.findOne({
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

    updateShippingReceipt = async (req, res) => {
        try {
            const schema = Joi.object({
                id: Joi.number().required(),
                shipping_receipt: Joi.string().required(),
            }).unknown(true);

            await schema.validateAsync(req.body);
            const id = req.body.id;
            
            await Transaction.update(req.body, {
                where: {
                    id: id
                }
            });

            const data = await Transaction.findOne({
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

    updatePaymentStatus = async (req, res) => {
        try {
            const schema = Joi.object({
                id: Joi.number().required(),
                payment_status: Joi.string().valid('PAID', 'UNPAID').required(),
            }).unknown(true);

            await schema.validateAsync(req.body);
            const id = req.body.id;
            
            await Transaction.update(req.body, {
                where: {
                    id: id
                }
            });

            const data = await Transaction.findOne({
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

}

module.exports = Controller;
