// module.exports = {
//   async up (queryInterface, Sequelize) {
//     await queryInterface.createTable('carts', {
//       id: {
//         type: Sequelize.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//       },
//       customer_id: {
//         type: Sequelize.STRING
//       },
//       product_id: {
//         type: Sequelize.STRING
//       },
//       note: {
//         type: Sequelize.STRING,
//         allowNull: true
//       },
//       qty: {
//         type: Sequelize.DOUBLE
//       },
//       unit_price: {
//         type: Sequelize.DOUBLE
//       },
//       total: {
//         type: Sequelize.DOUBLE
//       },
//       created_at: {
//         type: Sequelize.DATE
//       },
//       updated_at: {
//         type: Sequelize.DATE
//       }
//     });
//   },

//   async down (queryInterface, Sequelize) {
//     await queryInterface.dropTable('carts');
//   }
// };
