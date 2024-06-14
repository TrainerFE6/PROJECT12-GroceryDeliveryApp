const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Cart extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Cart.belongsTo(models.Product, { foreignKey: 'product_id' });
        }
    }

    Cart.init(
        {
            customer_id: DataTypes.STRING,
            product_id: {
                type: DataTypes.STRING,
                allowNull: true, // set product_id as nullable
            },
            // note: DataTypes.STRING,
            quantity: DataTypes.DOUBLE,
            price: DataTypes.DOUBLE,
            subtotal: DataTypes.DOUBLE,
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'Cart',
            underscored: true,
        },
    );
    return Cart;
};
