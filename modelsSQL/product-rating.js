const Sequelize=require('sequelize');

const sequelize=require('../util/databaseSql');
const User = require('./user');

const ProductRating=sequelize.define('productRating',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey: true
    },
    mongoUser:Sequelize.STRING,
    mongoProd:Sequelize.STRING,
    rating:Sequelize.INTEGER
});
module.exports=ProductRating;