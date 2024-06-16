const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Cities extends Model {
        static associate(models) {
        }
    }

    Cities.init(
        {
            name: DataTypes.STRING,
            province_id: DataTypes.INTEGER,
            type: DataTypes.STRING,
            postal_code: DataTypes.STRING,
            
    
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'Cities',
            underscored: true,
        },
    );
    return Cities;
};
