const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class TransactionDetail extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
          //  Slider.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
            TransactionDetail.belongsTo(models.Transaction, { foreignKey: 'transaction_id', targetKey: 'id' });
            TransactionDetail.belongsTo(models.Product, { foreignKey: 'product_id', targetKey: 'id' });
        }
    }

    TransactionDetail.init(
        {
            transaction_id: DataTypes.INTEGER,
            product_id: DataTypes.INTEGER,
            quantity: DataTypes.FLOAT,
            price: DataTypes.FLOAT,
            subtotal: DataTypes.FLOAT,

            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,

        },
        {
            sequelize,
            modelName: 'TransactionDetail',
            underscored: true,
        },
    );
    return TransactionDetail;
};
