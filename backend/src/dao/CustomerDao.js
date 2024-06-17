const SuperDao = require('./SuperDao');
const models = require('../models');

const Customers = models.Customers;

class CustomerDao extends SuperDao {
    constructor() {
        super(Customers);
    }

    async findByEmail(email) {
        return Customers.findOne({ where: { email } });
    }

    async isEmailExists(email) {
        return Customers.count({ where: { email } }).then((count) => {
            if (count != 0) {
                return true;
            }
            return false;
        });
    }

    async createWithTransaction(customer, transaction) {
        return Customers.create(customer, { transaction });
    }
}

module.exports = CustomerDao;
