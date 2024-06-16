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
const crypto = require('crypto');
const { PaymentMethod, Transaction } = require('../models');

class Controller {
    syncPayment = async (req, res) => {
        try {
            const response = await axios.get(config.tripay.url+'/payment-channel', {
                headers: {
                    Authorization: 'Bearer '+config.tripay.apiKey,
                    'content-type': 'application/x-www-form-urlencoded'
                }
            });
            // console.log(response.data.data);
            const data = response?.data?.data?.map((x) => {
                return {
                    code: x.code,
                    name: x.name,
                    group: x.group,
                    icon_url: x.icon_url,
                    fee: x.total_fee.flat,
                    // status: x.status,
                    // created_at: x.created_at,
                    // updated_at: x.updated_at,
                }
            });

            await PaymentMethod.bulkCreate(data, {
                updateOnDuplicate: ['name', 'group', 'icon_url', 'fee']
            });

            res.status(httpStatus.OK).send({
                message: 'Cost data',
                data: data || [],
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    getPayment = async (req, res) => {
        try {
            const data = await PaymentMethod.findAll();
            res.status(httpStatus.OK).send({
                message: 'Cost data',
                data: data || [],
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
    
    signature = async (merchant_ref, amount) => {
        const merchant_code = config.tripay.merchantCode;
        const privateKey = config.tripay.privateKey;
        var signature = crypto.createHmac('sha256', privateKey)
            .update(merchant_code + merchant_ref + amount)
            .digest('hex');
        return signature;
    };
    reqTransactinon = async (customer, method, amount, items) => {
        console.log('tripay')
        var expiry = parseInt(Math.floor(new Date()/1000) + (24*60*60));
        const merchant_ref = `INV-${Date.now()}-${Math.random().toString(36).substring(2)}`;
        const signature = await this.signature(merchant_ref, 10000);

        var payload = {
            'method': method,
            'merchant_ref': merchant_ref,
            'amount': amount,
            'customer_name': customer.name,
            'customer_email': customer.email,
            'customer_phone': '089506373551',
            'order_items': items,
            'return_url': 'https://domainanda.com/redirect',
            'expired_time': expiry,
            'signature': signature
        }

        const response = await axios.get(config.tripay.url+'/transaction/create', {
            headers: {
                Authorization: 'Bearer '+config.tripay.apiKey,
                'content-type': 'application/x-www-form-urlencoded'
            }
        });

        return response.data.data;
    };

    callback = async (req, res) => {
        try {
            const data = req.body;
            console.log(data);

            const tran = await Transaction.findOne({
                where: {
                    payment_reference: data.reference
                }
            });

            if (!tran) {
                res.status(httpStatus.NOT_FOUND).send({
                    message: 'Transaction not found',
                    success: false,
                });
            }

            await Transaction.update({
                payment_status: data.status
            }, {
                where: {
                    payment_reference: data.reference
                }
            });

            res.status(httpStatus.OK).send({
                message: 'Callback',
                success: true,
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

}

module.exports = Controller;
