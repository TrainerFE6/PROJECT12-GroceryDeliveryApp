const httpStatus = require('http-status');
const logger = require('../config/logger');
const Joi = require('joi');
const { tokenTypes } = require('../config/tokens');
const {Categories,Slider, Product} = require('../models'); // Add this line to import the Slider model

class Controller {

    create = async (req, res) => {
        try {
            const schema = Joi.object({
                name: Joi.string().required(),
                path: Joi.string().required(),
                originalname: Joi.string().required(),
                mimetype: Joi.string().required(),
                size: Joi.number().required(),

                // product_id: Joi.string().required(),
            }).unknown(true);

            await schema.validateAsync(req.body);
            console.log(req.body)
            const data = await Categories.create(req.body);
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
            const data = await Categories.findAll();
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
            const data = await Categories.findOne({
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
                path: Joi.string().required(),
                originalname: Joi.string().required(),
                mimetype: Joi.string().required(),
                size: Joi.string().required(),
                // product_id: Joi.string().required(),
            }).unknown(true);

            await schema.validateAsync(req.body);
            const id = req.body.id;
            
            await Categories.update(req.body, {
                where: {
                    id: id
                }
            });

            const data = await Categories.findOne({
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
            const pr = await Product.findOne({
                where: {
                    category_id: req.body.id
                }
            });
            if (pr) {
                res.status(httpStatus.BAD_REQUEST).send({
                    status: false,
                    message: 'Tidak bisa menghapus kategori yang memiliki produk',
                });
                return;
            }

            const data = await Categories.destroy({
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
