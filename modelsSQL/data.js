const Sequelize=require('sequelize');

const sequelize=require('../util/databaseSql');

const Data = sequelize.define('data', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  uri:Sequelize.STRING,
});

module.exports = Data;
