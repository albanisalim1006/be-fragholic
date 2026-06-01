'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Produk extends Model {
    static associate(models) {
      Produk.belongsTo(models.Kategori, { foreignKey: 'kategori_id' });
      Produk.hasMany(models.Keranjang, { foreignKey: 'produk_id' });
      Produk.hasMany(models.DetailPesanan, { foreignKey: 'produk_id' });
    }
  }
  Produk.init({
    kategori_id: DataTypes.INTEGER,
    nama_produk: DataTypes.STRING,
    deskripsi: DataTypes.TEXT,
    harga: DataTypes.DECIMAL(10, 2),
    stok: DataTypes.INTEGER,
    foto: DataTypes.STRING,
    merek: DataTypes.STRING,
    ukuran_ml: DataTypes.INTEGER,
    gender: DataTypes.ENUM('pria', 'wanita', 'unisex')
  }, {
    sequelize,
    modelName: 'Produk',
  });
  return Produk;
};