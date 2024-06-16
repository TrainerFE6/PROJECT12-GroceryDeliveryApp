const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Categories extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
          //  Slider.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
        }
    }

    Categories.init(
        {
            name: DataTypes.STRING,
            path: DataTypes.STRING,
            originalname: DataTypes.STRING,
            mimetype: DataTypes.STRING,
            size: DataTypes.INTEGER,
    
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'Categories',
            underscored: true,
        },
    );
    return Categories;
};
