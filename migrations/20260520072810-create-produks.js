'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Produks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      kategori_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Kategoris',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      nama_produk: {
        type: Sequelize.STRING
      },
      deskripsi: {
        type: Sequelize.TEXT
      },
      harga: {
        type: Sequelize.DECIMAL(10, 2)
      },
      stok: {
        type: Sequelize.INTEGER
      },
      foto: {
        type: Sequelize.STRING
      },
      merek: {
        type: Sequelize.STRING
      },
      ukuran_ml: {
        type: Sequelize.INTEGER
      },
      gender: {
        type: Sequelize.ENUM('pria', 'wanita', 'unisex')
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
    await queryInterface.dropTable('Produks');
  }
};