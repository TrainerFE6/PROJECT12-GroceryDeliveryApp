module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING
      },
      category_id: {
        type: Sequelize.NUMBER
      },
      sku: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      min_order: {
        type: Sequelize.INTEGER,
        
        defaultValue:1
      },
      weight: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.STRING
      },
      stock: {
        type: Sequelize.STRING
      },
      created_at: {
        type: Sequelize.DATE
      },
      updated_at: {
        type: Sequelize.DATE
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  }
};
