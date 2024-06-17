const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Product.hasMany(models.ProductImage, { foreignKey: 'product_id' });
            Product.belongsTo(models.Categories, { foreignKey: 'category_id' });
            // Product.hasMany(models.ProductImage, { foreignKey: 'product_id' });
          //  Slider.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
        }
    }

    Product.init(
        {
            name: DataTypes.STRING,
            category_id: DataTypes.NUMBER,
            sku: DataTypes.STRING,
            description: DataTypes.STRING,
            min_order: DataTypes.INTEGER,
            weight: DataTypes.STRING,
            price: DataTypes.STRING,
            stock: DataTypes.STRING,
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'Product',
            underscored: true,
        },
    );
    return Product;
};
