const Sequelize=require('sequelize');

const sequelize=require('../util/databaseSql');

const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  mongoId:Sequelize.STRING,
  email : Sequelize.STRING,
});

module.exports = User;
