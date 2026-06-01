'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Pesanan extends Model {
    static associate(models) {
      Pesanan.belongsTo(models.User, { foreignKey: 'user_id' });
      Pesanan.hasMany(models.DetailPesanan, { foreignKey: 'pesanan_id' });
    }
  }
  Pesanan.init({
    user_id: DataTypes.INTEGER,
    total_harga: DataTypes.DECIMAL(10, 2),
    status: DataTypes.ENUM('pending', 'dikonfirmasi', 'dikirim', 'selesai'),
    alamat_kirim: DataTypes.TEXT,
    bukti_bayar: DataTypes.STRING,
    nama_ekspedisi: DataTypes.STRING,
    nomor_resi: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Pesanan',
  });
  return Pesanan;
};