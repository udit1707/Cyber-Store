/* USING SEQUELIZE */
const Sequelize=require('sequelize');

const sequelize=require('../util/database');//database connection pool i.e. managed by sequelize is imported in this line 
const Product = sequelize.define('product', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title: Sequelize.STRING,
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Product;















// const products= [];
// module.exports= class product {
//     constructor(t){
//         this.title=t;
//     }
//     save(){
//         product.push(this);
//     }
//     static fetchAll(){
//         return products;
//     }
// }

/*Storing Data in files via the model*/

// const Cart=require('./cart');
// USING MYSQL DATABASE const db=require('../util/database');

// const fs=require('fs');
// const path=require('path');
// const p=path.join(path.dirname(process.mainModule.filename),'data','products.json');
// const getProductsFromFile=cb=>{

// fs.readFile(p,(err,fileContent)=>{
//     if(err){
//        return cb([]);
//     }
//     cb(JSON.parse(fileContent));
// });};

// module.exports= class Product {
//     constructor(id,title,imageUrl, price,description ){
//       this.id=id;  
//       this.title=title;
//         this.imageUrl=imageUrl;
//         this.description=description;
//         this.price=price;
        
//     }
//     save(){
//                   /* Using File*/         
      
//          //    getProductsFromFile(products=>{

//          //    if(this.id){
//          //    const existingProductIndex=products.findIndex(p=>p.id===this.id);
//          //    const updatedProducts=[...products];
//          //    updatedProducts[existingProductIndex]=this;
 
//          //    fs.writeFile(p,JSON.stringify(updatedProducts),(err)=>{console.log(err);});


//          //    }
//          //    else{

//          //    this.id=Math.random().toString();
//          //    products.push(this); 
//          //    fs.writeFile(p,JSON.stringify(products),(err)=>{console.log(err);});
//          //    }
//          // });
//               //console.log(fileContent);

//         /*Using Database */  
//          return db.execute('INSERT INTO products (title,price,imageUrl,description) VALUES(?,?,?,?)',
//          [this.title,this.price,this.imageUrl,this.description]
//          );
       
          
    
    
//     }
//     static deleteById(id){
//       //  getProductsFromFile(products=>{
//       //    const product=products.find(prod=>prod.id===id);
//       //    const updatedProducts=products.filter(p=>p.id!==id);
//       //    fs.writeFile(p,JSON.stringify(updatedProducts),(err)=>{
//       //       if(!err){
//       //          Cart.deleteProduct(id,product.price);
//       //       }
//       //       //console.log(err)
//       //    });

//       //  });

//     }
    
    
//     static fetchAll(cb){

//      return db.execute('SELECT * FROM products');
//    //     getProductsFromFile(cb);
//     }
//     static findById(id)/*insread of callbacks(cb) we use promises in database */
//     {
//       //  getProductsFromFile(products=>{
//       //     const product=products.find(p=> p.id=== id);
//       //     cb(product);
//       //  });
//       //Using Database

//       return db.execute('SELECT * FROM products WHERE products.id = ?',[id]);
//     }
// };

