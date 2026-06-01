'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Kategoris', [
      { nama_kategori: 'Niche', deskripsi: 'Parfum eksklusif dari brand independen', createdAt: new Date(), updatedAt: new Date() },
      { nama_kategori: 'Designer', deskripsi: 'Parfum dari brand fashion ternama', createdAt: new Date(), updatedAt: new Date() },
      { nama_kategori: 'Lokal', deskripsi: 'Parfum produksi dalam negeri', createdAt: new Date(), updatedAt: new Date() },
      { nama_kategori: 'Timur Tengah', deskripsi: 'Parfum khas dari wilayah timur tengah', createdAt: new Date(), updatedAt: new Date() },
    ])
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Kategoris', null, {})
  }
}