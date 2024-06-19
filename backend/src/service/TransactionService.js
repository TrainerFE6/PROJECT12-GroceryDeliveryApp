const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const UserDao = require('../dao/UserDao');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');
const { userConstant } = require('../config/constant');
const config = require('../config/config');
const crypto = require('crypto');
const { default: axios } = require('axios');

class TransactionService {
    signature = async (merchant_ref, amount) => {
        const merchant_code = config.tripay.merchantCode;
        const privateKey = config.tripay.privateKey;
        console.log(merchant_code, merchant_ref, amount)
        var signature = crypto.createHmac('sha256', privateKey)
            .update(merchant_code + merchant_ref + amount)
            .digest('hex');
        return signature;
    };
    reqTransaction = async (customer, method, amount, items) => {
        try {
            console.log('tripay service')
            var expiry = parseInt(Math.floor(new Date()/1000) + (24*60*60));
            const merchant_ref = `INV-${Date.now()}-${Math.random().toString(36).substring(2)}`;
            const signature = await this.signature(merchant_ref, amount);
    
            var payload = {
                'method': method,
                'merchant_ref': merchant_ref,
                'amount': amount,
                'customer_name': customer.name,
                'customer_email': customer.email,
                'customer_phone': '089506373551',
                'order_items': items,
                'return_url': 'https://grocery.web-ditya.my.id',
                'expired_time': expiry,
                'signature': signature
            }
    
            console.log(payload)
            console.log(config.tripay.url+'/transaction/create')
            const response = await axios.post(config.tripay.url+'/transaction/create', payload, {
                headers: {
                    Authorization: 'Bearer '+config.tripay.apiKey,
                    // 'content-type': 'application/x-www-form-urlencoded'
                }
            });
    
            return response.data.data;
        } catch (error) {
            console.log(error.response.data)
            console.log('error tripay service')
            throw new Error(error);
            return null;
        }
    }
}

module.exports = TransactionService;
