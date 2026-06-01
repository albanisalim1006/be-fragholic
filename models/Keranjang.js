'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Keranjang extends Model {
    static associate(models) {
      Keranjang.belongsTo(models.User, { foreignKey: 'user_id' });
      Keranjang.belongsTo(models.Produk, { foreignKey: 'produk_id' });
    }
  }
  Keranjang.init({
    user_id: DataTypes.INTEGER,
    produk_id: DataTypes.INTEGER,
    jumlah: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Keranjang',
  });
  return Keranjang;
};