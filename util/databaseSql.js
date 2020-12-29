const Sequelize=require('sequelize');
const sequelize=new Sequelize('{DATABASE}','{USERNAME}','{PASSWORD}',{dialect:'mysql',host:'{HOST}',storage: "./session.sqlite"});
 module.exports=sequelize;
