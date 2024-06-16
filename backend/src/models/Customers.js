const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Customers extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Customers.belongsTo(models.Provinces, { foreignKey: 'province_id' });
            Customers.belongsTo(models.Cities, { foreignKey: 'city_id' });
        }
    }

    Customers.init(
        {
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            phone_number: DataTypes.STRING,
            province_id: DataTypes.STRING,
            city_id: DataTypes.STRING,
            address: DataTypes.STRING,
            password: DataTypes.STRING,
    
    
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'Customers',
            underscored: true,
        },
    );
    return Customers;
};
