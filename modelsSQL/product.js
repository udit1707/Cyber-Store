const Sequelize=require('sequelize');

const sequelize=require('../util/databaseSql');//database connection pool i.e. managed by sequelize is imported in this line 
const Product = sequelize.define('product', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: Sequelize.STRING,
  image:Sequelize.STRING,
  mongoId:Sequelize.STRING,
  mean_rating:{
    type:Sequelize.DOUBLE,
    defaultValue: 0.0
  },
  count_ratings:{
     type:Sequelize.INTEGER,
     defaultValue:0
  }
});

module.exports = Product;
