const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Slider extends Model {
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

    Slider.init(
        {
            path: DataTypes.STRING,
            title: DataTypes.STRING,
            description: DataTypes.STRING,
            product_id: {
                type: DataTypes.STRING,
                allowNull: true, // set product_id as nullable
            },
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'Slider',
            underscored: true,
        },
    );
    return Slider;
};
