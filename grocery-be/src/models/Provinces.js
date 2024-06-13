const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Provinces extends Model {
        static associate(models) {
        }
    }

    Provinces.init(
        {
            name: DataTypes.STRING,
    
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'Provinces',
            underscored: true,
        },
    );
    return Provinces;
};
