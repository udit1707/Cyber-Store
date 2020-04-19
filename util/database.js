/* NOSQL Implementation */

const mongodb=require('mongodb')
const MongoClient=mongodb.MongoClient;

let _db;

const mongoConnect=(callback)=>{

MongoClient.connect('mongodb+srv://uditsingh294:udit1998@cluster0-aqzf0.mongodb.net/shop?retryWrites=true&w=majority')
.then((client)=>{
    console.log(client);
    _db=client.db();
    //or _db=client.db('database_name') we can explicitly mention database name here tho optional we already do in url string
    callback();
})
.catch(
    err=>{console.log(err)
     throw err;  
});
}

const getDb=()=>{
    if(_db)
    {return _db;}
    throw 'No database Found!';
}

exports.mongoConnect=mongoConnect;
exports.getDb=getDb;


/* SQL Implementation */
// const Sequelize = require('sequelize');
// const sequelize=new Sequelize('node-complete','root','5511',{dialect:'mysql',host:'localhost'});
// module.exports=sequelize;


//Sequelize uses below code behind the scenes.
// const mysql =require('mysql2');
// const pool=mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database:'node-complete',
//     password:'5511'

// });

// module.exports=pool.promise();