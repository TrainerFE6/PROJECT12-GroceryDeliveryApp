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

class Controller {
    provinces = async (req, res) => { 
        try {
            const data = await Provinces.findAll();

            res.status(httpStatus.OK).send({
                message: 'Provinces data',
                data: data,
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    cities = async (req, res) => {
        try {
            const where = {};
            if (req.query.province_id) {
                where.province_id = req.query.province_id;
            }
            const data = await Cities.findAll({
                where: where,
            });

            res.status(httpStatus.OK).send({
                message: 'Cities data',
                data: data,
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    cost = async (req, res) => {
        try {
            const { origin, destination, weight, courier } = req.body;

            console.log('key', config.rajaOngkir.key);

            const response = await axios.post('https://api.rajaongkir.com/starter/cost', {
                origin: origin,
                destination: destination,
                weight: weight,
                courier: courier
            }, {
                headers: {
                    key: config.rajaOngkir.key,
                    'content-type': 'application/x-www-form-urlencoded'
                }
            });

            res.status(httpStatus.OK).send({
                message: 'Cost data',
                data: response?.data?.rajaongkir?.results || [],
            });
        } catch (e) {
            logger.error(e.response);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

}

module.exports = Controller;
