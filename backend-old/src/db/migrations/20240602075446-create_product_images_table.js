module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('product_images', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      product_id: {
        type: Sequelize.NUMBER
      },
      path: {
        type: Sequelize.STRING
      },
      originalname: {
        type: Sequelize.STRING
      },
      mimetype: {
        type: Sequelize.STRING
      },
      size: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('product_images');
  }
};
