const Sequelize=require('sequelize');

const sequelize=require('../util/databaseSql');

const Rating=sequelize.define('rating',{
    id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
          },
    value:Sequelize.INTEGER
});
module.exports=Rating;







