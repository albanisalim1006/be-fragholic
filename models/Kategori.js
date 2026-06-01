'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Kategori extends Model {
    static associate(models) {
      Kategori.hasMany(models.Produk, { foreignKey: 'kategori_id' });
    }
  }
  Kategori.init({
    nama_kategori: DataTypes.STRING,
    deskripsi: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Kategori',
  });
  return Kategori;
};