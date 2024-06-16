const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ProductImage extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            ProductImage.belongsTo(models.Product, { foreignKey: 'product_id' });
          //  Slider.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
        }
    }

    ProductImage.init(
        {
            product_id: DataTypes.NUMBER,
            path: DataTypes.STRING,
            originalname: DataTypes.STRING,
            mimetype: DataTypes.STRING,
            size: DataTypes.STRING,
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'ProductImage',
            underscored: true,
        },
    );
    return ProductImage;
};
