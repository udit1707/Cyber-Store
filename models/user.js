/*USING MONGOOSE NOSQL */
const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const userSchema=new Schema({
  
  email:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  cart:{
    items:[{productId:{type:Schema.Types.ObjectId,ref:'Product' ,required:true},quantity:{type:Number,required:true}}]
  }
});

userSchema.methods.addToCart=function(product){
  
  
  let updatedCart;
  const cartProduct=this.cart.items.findIndex(cp=>{
     return cp.productId.toString() === product._id.toString();
   });
   const oldItems=[...this.cart.items];
   if(cartProduct>=0)
   {
     const oldQty=this.cart.items[cartProduct].quantity;
     oldItems[cartProduct].quantity=oldQty+1;
     const updatedCartItems=[...oldItems];
     const updatedCart={items:updatedCartItems};
     this.cart=updatedCart;
  return this.save();
     
   }
   else{    
    oldItems.push({productId: product._id,quantity:1});
    const updatedCartItems=[...oldItems];
    const updatedCart={items:updatedCartItems};
    this.cart=updatedCart;
  return this.save();
  
  }

  

};
userSchema.methods.deleteCartItem=function(product){
    const oldItems=[...this.cart.items];
    const newItems=oldItems.filter(p=>  p.productId.toString() !== product._id.toString());
    const updatedCart={items:newItems};
    this.cart=updatedCart;
    return this.save();
}
userSchema.methods.clearCart=function(){
  this.cart={items:[]};
  return this.save();
};



module.exports=mongoose.model('User',userSchema);

//USING MONGODB const getDb=require('../util/database').getDb;
// const mongodb=require('mongodb');
// class User{
//   constructor(username,email,cart,id)
// {
//   this.name=username;
//   this.email=email;
//   this.cart=cart;  // {items:[]}
//   this._id=id;
// }
  
// save()
// {
//   const db=getDb();
//   return db.collection('users').insertOne(this);
//   // .then(result=>{
//   //   console.log("User Saved");

//   // })
//   // .catch(err=>{console.log(err);});
// }

// addToCart(product){
//   const db=getDb();
//   let dbOp;
//   let updatedCart;
//   const cartProduct=this.cart.items.findIndex(cp=>{
//      return cp.productId.toString() === product._id.toString();
//    });
//    const oldItems=[...this.cart.items];
//    if(cartProduct>=0)
//    {
//      const oldQty=this.cart.items[cartProduct].quantity;
//      oldItems[cartProduct].quantity=oldQty+1;
//      const updatedCartItems=[...oldItems];
//      const updatedCart={items:updatedCartItems};
//      dbOp= db.collection('users').updateOne({_id:new mongodb.ObjectId(this._id)},
//      {$set:{cart:updatedCart}} );
//    }
//    else{    
//     oldItems.push({productId: new mongodb.ObjectId(product._id),quantity:1});
//     const updatedCartItems=[...oldItems];
//     updatedCart={items:updatedCartItems};
   
//   dbOp=db.collection('users').updateOne({_id:new mongodb.ObjectId(this._id)},
//    {$set:{cart:updatedCart}} 
//    );
//   }

//    return dbOp;
// }


// getCart(){
//   const db=getDb();
//   const productIds=this.cart.items.map(i=>{
//     return i.productId;
//   });
//   return db.collection('products').find({_id:{$in:productIds}}).toArray() 
//   .then(products=>{
//     console.log(products);
//     return products.map(p=>{
//       return{...p,
//         quantity:this.cart.items.find(i=>{return i.productId.toString() === p._id.toString();
//       }).quantity
//     };
//     });
//   })
//   .then(products=>{
//     return products;

//   });
  

// }

// deleteCartItem(product){
//   const db=getDb();
//   const oldItems=[...this.cart.items];
//   const newItems=oldItems.filter(p=>  p.productId.toString() !== product._id.toString());
//   const updatedCart={items:newItems};
//   return db.collection('users').updateOne({_id:new mongodb.ObjectId(this._id)},{$set:{cart:updatedCart}});
// }

// addOrder(){
// const db=getDb();
// return this.getCart()
// .then(products=>{
//   const order={items:products,
//     user:{
//       _id:new mongodb.ObjectId(this._id),
//       name:this.name,
//       email:this.email
//     }};
//     return db.collection('orders').insertOne(order);

// })
// .then(result=>{this.cart={items:[]};
//   return db.collection('users').updateOne({_id:new mongodb.ObjectId(this._id)},{$set:{cart:{items:[]}}});
 
  
// });
// }

// getOrders(){
//   const db=getDb();
//   return db.collection('orders').find({'user._id': new mongodb.ObjectId(this._id)}).toArray()
//   ;
// }

// static findById(userId)
// {
//   const db=getDb();
//   return db.collection('users').find({_id: new mongodb.ObjectId(userId)}).next()
//   .then(user=>{
//     // console.log(user);
//     return user;
//   })
//   .catch(err=>{console.log(err);});

// }

// }
// module.exports=User;



/* USING SEQUELIZE */
// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const User = sequelize.define('user', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   },
//   name: Sequelize.STRING,
//   email: Sequelize.STRING
// });

// module.exports = User;