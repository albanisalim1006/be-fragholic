'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DetailPesanans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pesanan_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Pesanans',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      produk_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Produks',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      jumlah: {
        type: Sequelize.INTEGER
      },
      harga_satuan: {
        type: Sequelize.DECIMAL(10, 2)
      },
      subtotal: {
        type: Sequelize.DECIMAL(10, 2)
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
    await queryInterface.dropTable('DetailPesanans');
  }
};