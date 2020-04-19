const getDb=require('../util/database').getDb;
const mongodb=require('mongodb');



/* Using Sequelize/MYSQL database */
// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const Cart = sequelize.define('cart', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   }
// });

// module.exports = Cart;


// using a file system database for cart
// const fs=require('fs');
// const path= require('path');
// const p=path.join(path.dirname(process.mainModule.filename),'data','cart.json');


// module.exports= class Cart{   
//     static addProduct(id,productPrice){
//         // Fetch the previous cart
//     fs.readFile(p,(err,fileContent)=>{
//        let cart={products:[], totalPrice:0};
//         if(!err){
//             cart=JSON.parse(fileContent);
//         }
//          // Analyze the cart => Find existing product
//          const existingProductIndex=cart.products.findIndex(prod=>prod.id=== id);
//          const existingProduct= cart.products[existingProductIndex];
//          let updatedProduct;
//          // Add new Product / increase quantity.
//          if(existingProduct)
//          {
//              updatedProduct={...existingProduct};
//              updatedProduct.qty=updatedProduct.qty+1;
//              cart.products=[...cart.products];
//              cart.products[existingProductIndex]=updatedProduct;
//          }
//          else
//          {
//            updatedProduct={id:id, qty:1};
//            cart.products=[...cart.products,updatedProduct];
//          }
//         cart.totalPrice=cart.totalPrice+ +productPrice;

//         fs.writeFile(p,JSON.stringify(cart),err=>{
//             console.log(err);
//         });
        
//     });
//     }

//     static deleteProduct(id, productPrice){

//         fs.readFile(p,(err,fileContent)=>{
            
//              if(err){return;}
//              let cart=JSON.parse(fileContent);
//              const updatedCart={...cart};
//              const product = updatedCart.products.find(p=>p.id===id);
//              if(!product)
//              {return ;}
//              const productQty=product.qty;
//              updatedCart.products= updatedCart.products.filter(prod=>prod.id!==id);


//              updatedCart.totalPrice=updatedCart.totalPrice-productQty*productPrice
             

//              fs.writeFile(p,JSON.stringify(updatedCart),err=>{
//                 console.log(err);
//             });

//         });

//     }

//     static getCart(cb){
//         fs.readFile(p,(err,fileContent)=>{
//             if(err)
//             {cb(null);}
//             else{
//             cb(JSON.parse(fileContent));}
//         //    const cart=JSON.parse(fileContent);
//         //     if(err)
//         //     {cb(null);}
//         //     else{
//         //     cb(cart);} 
//         });


//     }

// }