'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DetailPesanan extends Model {
    static associate(models) {
      DetailPesanan.belongsTo(models.Pesanan, { foreignKey: 'pesanan_id' });
      DetailPesanan.belongsTo(models.Produk, { foreignKey: 'produk_id' });
    }
  }
  DetailPesanan.init({
    pesanan_id: DataTypes.INTEGER,
    produk_id: DataTypes.INTEGER,
    jumlah: DataTypes.INTEGER,
    harga_satuan: DataTypes.DECIMAL(10, 2),
    subtotal: DataTypes.DECIMAL(10, 2)
  }, {
    sequelize,
    modelName: 'DetailPesanan',
  });
  return DetailPesanan;
};