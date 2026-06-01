'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Pesanans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      total_harga: {
        type: Sequelize.DECIMAL(10, 2)
      },
      status: {
        type: Sequelize.ENUM('pending', 'dikonfirmasi', 'dikirim', 'selesai')
      },
      alamat_kirim: {
        type: Sequelize.TEXT
      },
      bukti_bayar: {
        type: Sequelize.STRING
      },
      nama_ekspedisi: {
        type: Sequelize.STRING
      },
      nomor_resi: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Pesanans');
  }
};