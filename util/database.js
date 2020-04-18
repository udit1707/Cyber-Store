const Sequelize = require('sequelize');
const sequelize=new Sequelize('node-complete','root','5511',{dialect:'mysql',host:'localhost'});
module.exports=sequelize;


//Sequelize uses below code behind the scenes.
// const mysql =require('mysql2');
// const pool=mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database:'node-complete',
//     password:'5511'

// });

// module.exports=pool.promise();