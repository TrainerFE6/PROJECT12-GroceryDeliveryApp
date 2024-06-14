const httpStatus = require('http-status');
const logger = require('../config/logger');
const { Sequelize, Transaction } = require('../models'); // Add this line to import the Slider model

class Controller {

    revenue = async (req, res) => {
        try {
            const paidData = await Transaction.findAll({
                where: {
                    payment_status: 'PAID'
                },
                attributes: [
                    [Sequelize.fn('MONTH', Sequelize.col('date')), 'month'],
                    [Sequelize.fn('SUM', Sequelize.col('total_price')), 'total_price']
                ],
                group: ['month'],
                order: Sequelize.literal('month ASC')
            });

            const unpaidData = await Transaction.findAll({
                where: {
                    payment_status: 'UNPAID'
                },
                attributes: [
                    [Sequelize.fn('MONTH', Sequelize.col('date')), 'month'],
                    [Sequelize.fn('SUM', Sequelize.col('total_price')), 'total_price']
                ],
                group: ['month'],
                order: Sequelize.literal('month ASC')
            });

            const monthlyTotals = Array(12).fill(0);
            const paidTotals = Array(12).fill(0);
            const unpaidTotals = Array(12).fill(0);

            paidData.forEach(item => {
                paidTotals[item.get('month') - 1] = item.get('total_price');
                monthlyTotals[item.get('month') - 1] += item.get('total_price');
            });

            unpaidData.forEach(item => {
                unpaidTotals[item.get('month') - 1] = item.get('total_price');
                monthlyTotals[item.get('month') - 1] += item.get('total_price');
            });

            res.status(httpStatus.OK).send({
                status: true,
                message: 'Success',
                paidData: paidTotals,
                unpaidData: unpaidTotals,
                monthlyTotals: monthlyTotals
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_REQUEST).send(e);
        }
    };
    
}

module.exports = Controller;
