const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Transaction extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
          //  Slider.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
          Transaction.hasMany(models.TransactionDetail, { foreignKey: 'transaction_id', targetKey: 'id' })
            Transaction.belongsTo(models.PaymentMethod, { foreignKey: 'payment_method_id', targetKey: 'id' });
            Transaction.belongsTo(models.Customers, { foreignKey: 'customer_id', targetKey: 'id' });
        }
    }

    Transaction.init(
        {
            customer_id: DataTypes.INTEGER,
            payment_method_id: DataTypes.INTEGER,
            date: DataTypes.DATE,
            invoice_number: DataTypes.STRING,
            shipping_code: DataTypes.STRING,
            shipping_receipt: DataTypes.STRING,
            shipping_service: DataTypes.STRING,
            product_price: DataTypes.DOUBLE,
            shipping_price: DataTypes.DOUBLE,
            total_price: DataTypes.DOUBLE,
            payment_price: DataTypes.DOUBLE,
            payment_reference: DataTypes.STRING,
            payment_status: DataTypes.STRING,
            payment_expire_time: DataTypes.TIME,
            payment_instruction: DataTypes.TEXT,
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,

        },
        {
            sequelize,
            modelName: 'Transaction',
            underscored: true,
        },
    );
    return Transaction;
};
