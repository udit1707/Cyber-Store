//const products=[]; we now use models
const Product=require('../models/product');
const Cart =require('../models/cart');
const Order=require('../models/order');

 exports.getProducts= (req,res, next)=>{
    //using sequelize package
    Product.findAll().then(products=>{
      console.log('products fetched'); 
      res.render('shop/product-list',{prods:products, pageTitle:'All Products',path:'/products' /*,hasProducts: products.length > 0, activeShop : true , productCSS:true*/ });
    
     })
     .catch(err=>{console.log(err);});



  
  
  // using mysql database Product.fetchAll()
    // .then(([rows,fieldData])=>{
    //   res.render('shop/product-list',{prods:rows, pageTitle:'All Products',path:'/products' /*,hasProducts: products.length > 0, activeShop : true , productCSS:true*/ });
    // })
    // .catch(err=>{console.log(err);});
    // console.log(adminData.products);
    // res.sendFile(path.join(rootDir,'views','shop.html'));
    //const products=adminData.products;
    // res.render('shop',{prods:products, pageTitle:'Shop',path:'/',hasProducts: products.length > 0, activeShop : true , productCSS:true });
    };

    exports.getProduct=(req,res,next)=>{
      const prodId=req.params.productId;
      //console.log(prodId);
    
     /*Using Sequelize*/
     //Method 1
     Product.findByPk(prodId)
     .then((product)=>{
      //console.log(product[0]);
      res.render('shop/product-detail',{product:product, pageTitle:'Product Details',path:'/product/prodID'});
    })
    .catch(err=>{console.log(err)});
     
    //Method 2
    
    // Product.findAll({where:{id:prodId}})
    // .then((products)=>{
    //   //console.log(product[0]);
    //   res.render('shop/product-detail',{product:products[0], pageTitle:'Product Details',path:'/product/prodID'});
    // })
    // .catch(err=>{console.log(err)});
 


     /*Using mysql database */ // Product.findById(prodId)
      // .then(([product])=>{
      //   //console.log(product[0]);
      //   res.render('shop/product-detail',{product:product[0], pageTitle:'Product Details',path:'/product/prodID'});
      // })
      // .catch(err=>{console.log(err)});
      
      
    }

exports.getIndex=(req,res,next)=>{
    
 Product.findAll().then(products=>{
  console.log('products fetched'); 
  res.render('shop/index',{
      prods:products ,
        pageTitle:'Shop',path:'/'  /*,
      hasProducts: products.length > 0,
         activeShop : true , productCSS:true */  });

 })
 .catch(err=>{console.log(err);});
 
 
 
  // Product.fetchAll()
  // .then(([rows,fieldData])=>{
  //   res.render('shop/index',{
  //     prods:rows ,
  //      pageTitle:'Shop',path:'/'  /*,
  //      hasProducts: products.length > 0,
  //     activeShop : true , productCSS:true */  });
  // }).catch(err=>{console.log(err);});
  
    


};    

exports.getCart=(req,res,next)=>{
  
req.user.getCart()
.then(cart=>{
    return cart.getProducts().then(products=>{
      res.render('shop/cart',{path:'/cart',
       pageTitle:'Your Cart',
       products: products
     });
    })
    .catch(err=>{console.log(err);});  
  //console.log(cart);
})
.catch(err=>{console.log(err);});
  // Cart.getCart(cart=>{
  //   Product.fetchAll(products=>{
  //    const cartProducts=[];
  //    for(let prod of products)
  //    {
  //      const cartProductData=cart.products.find(p=>p.id===prod.id);
  //      if(cartProductData)
  //      {
  //        cartProducts.push({productData:prod, qty: cartProductData.qty});
  //      }

  //    }    
  
  //     res.render('shop/cart',{path:'/cart',
  //     pageTitle:'Your Cart',
  //     products: cartProducts
  //   });

  //   });
    
    
  
  // });

  
};

exports.postCart=(req,res,next)=>{

 const prodId= req.body.productId;
 let fetchedCart;
  let newQuantity = 1;
 req.user
 .getCart()
 .then(cart=>{
   fetchedCart=cart
   return fetchedCart.getProducts({where:{id:prodId}});
 })
 .then(products=>{
  let product; 
  if(products.length>0)
   {product=products[0];
   }
   if(product)
   {
     const oldQuantity=product.cartItem.quantity;
     newQuantity=oldQuantity+1;
     return product;}
    // return fetchedCart.addProduct(product,{through:{quantity:newQuantity}});
      
   
   return Product.findByPk(prodId);
 }).then(product=>{
  return fetchedCart.addProduct(product,{through:{quantity:newQuantity}});
 })
  
  .then(()=>{
     res.redirect('/cart');
   })
   .catch(err=>{console.log(err);});

  
 //  Product.findById(prodId,(product)=>{
//    Cart.addProduct(prodId,product.price);


//  });
//  res.redirect('/cart');

};

exports.postCartDeleteProduct=(req,res,next)=>{

  const prodId=req.body.productId;
  req.user.getCart()
  .then(cart=>{
    return cart.getProducts({where:{id:prodId}})
  })
  .then(products=>{
    const product=products[0];
    return product.cartItem.destroy();
  })
  .then(result=>{
    res.redirect('/cart');

  })

  .catch(err=>{console.log(err);});

  // Product.findById(prodId,(prod)=>{ 
     
  //   Cart.deleteProduct(prodId,prod.price);
  //   res.redirect('/cart');

  // });
};

exports.postOrder=(req,res,next)=>{

    let fetchedCart;   
     req.user.getCart()
     .then(cart=>{
         fetchedCart=cart;
         return cart.getProducts();
     })
     .then(products=>{
       return req.user.createOrder()
       .then(order=>{
         return order.addProducts(products.map(product=>{
           product.orderItem={quantity:product.cartItem.quantity};
           return product;
         }));
       })
       .catch(err=>console.log(err));
     })
     .then(result => {
      return fetchedCart.setProducts(null);
    })
    .then(result => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({include: ['products']})
    .then(orders => {
      console.log(orders);
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => console.log(err));
};

exports.getCheckout=(req,res,next)=>{

    res.render('shop/checkout',{
      path:'/checkout',
      pageTitle:'Checkout'
    });
};