'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Pesanan, { foreignKey: 'user_id' });
      User.hasMany(models.Keranjang, { foreignKey: 'user_id' });
    }
  }
  User.init({
    nama: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.ENUM('admin', 'customer'),
    no_hp: DataTypes.STRING,
    alamat: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};