const httpStatus = require('http-status');
const logger = require('../config/logger');
const Joi = require('joi');
const { tokenTypes } = require('../config/tokens');
const {ProductImage} = require('../models'); // Add this line to import the Slider model

class Controller {

    create = async (req, res) => {
        try {
            const schema = Joi.object({
                product_id: Joi.number().required(),
                path: Joi.string().required(),
                originalname: Joi.string().required(),
                mimetype: Joi.string().required(),
                size: Joi.string().required(),
            }).unknown(true);

            await schema.validateAsync(req.body);
            console.log(req.body)
            const data = await ProductImage.create(req.body);
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
            if (req.query.product_id) {
                where.product_id = req.query.product_id;
            }
            const data = await ProductImage.findAll({
                where: where
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
            const data = await ProductImage.findOne({
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
                product_id: Joi.number().required(),
                path: Joi.string().required(),
                originalname: Joi.string().required(),
                mimetype: Joi.string().required(),
                size: Joi.string().required(),
                // product_id: Joi.string().required(),
            }).unknown(true);

            await schema.validateAsync(req.body);
            const id = req.body.id;
            
            await ProductImage.update(req.body, {
                where: {
                    id: id
                }
            });

            const data = await ProductImage.findOne({
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
            const data = await ProductImage.destroy({
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
