module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      customer_id: {
        type: Sequelize.INTEGER
      },
      payment_method_id: {
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATE
      },
      invoice_number: {
        type: Sequelize.INTEGER
      },
      shipping_code: {
        type: Sequelize.STRING,
      },
      shipping_receipt: {
        type: Sequelize.STRING
      },
      shipping_service: {
        type: Sequelize.STRING
      },
      product_price: {
        type: Sequelize.DOUBLE
      },
      shipping_price: {
        type: Sequelize.DOUBLE
      },
      payment_price: {
        type: Sequelize.DOUBLE
      },
      total_price: {
        type: Sequelize.DOUBLE
      },
      payment_reference: {
        type: Sequelize.STRING
      },
      payment_status: {
        type: Sequelize.STRING
      },
      payment_expire_time: {
        type: Sequelize.TIME
      },
      payment_instruction: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('transactions');
  }
};