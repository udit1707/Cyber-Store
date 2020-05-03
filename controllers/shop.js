//const products=[]; we now use models
const path=require('path');
const Product=require('../models/product');
const Order=require('../models/order');
const stripe=require('stripe')(
  process.env.STRIPE_KEY
//add secret key provided by stripe
);
const fs=require('fs');
const PDFDocument=require('pdfkit');
const ITEMS_PER_PAGE=2;
// const Cart =require('../models/cart');
// const Order=require('../models/order');

 exports.getProducts= (req,res, next)=>{
    //using sequelize package
    const page=+req.query.page||1;
 let totalItems;
 Product.find().countDocuments().then(numProducts=>{
  totalItems=numProducts;
  return Product.find()
  .skip((page-1)* ITEMS_PER_PAGE)
  .limit(ITEMS_PER_PAGE); 
})  
    .then(products=>{
      console.log(products);
      res.render('shop/product-list',{prods:products, pageTitle:'All Products',path:'/products', isAuthenticated:req.session.isLoggedIn
      ,
        currentPage:page,
        hasNextPage:ITEMS_PER_PAGE*page<totalItems,
        hasPreviousPage:page>1,
        nextPage:page+1,
        previousPage:page-1,
        lastPage: Math.ceil(totalItems/ITEMS_PER_PAGE)
      /*,hasProducts: products.length > 0, activeShop : true , productCSS:true*/ });

    })
    .catch(err=>{console.log(err);});
    // Product.findAll().then(products=>{
    //   console.log('products fetched'); 
    //   res.render('shop/product-list',{prods:products, pageTitle:'All Products',path:'/products' /*,hasProducts: products.length > 0, activeShop : true , productCSS:true*/ });
    
    //  })
    //  .catch(err=>{console.log(err);});



  
  
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
      console.log(prodId);
    
      Product.findById(prodId)
      .then(product=>{
        res.render('shop/product-detail',{product:product, pageTitle:'Product Details',path:'/product/prodID', isAuthenticated:req.session.isLoggedIn});
      })
      .catch(err=>{console.log(err);});


    
    //  /*Using Sequelize*/
    //  //Method 1
    //  Product.findByPk(prodId)
    //  .then((product)=>{
    //   //console.log(product[0]);
    //   res.render('shop/product-detail',{product:product, pageTitle:'Product Details',path:'/product/prodID'});
    // })
    // .catch(err=>{console.log(err)});
     
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
  const page=+req.query.page||1;
 let totalItems;

  Product.find().countDocuments().then(numProducts=>{
    totalItems=numProducts;
    return Product.find()
    .skip((page-1)* ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE); 
  })  
  .then(products=>{
   
    res.render('shop/index',{
      prods:products ,
        pageTitle:'Shop',
        path:'/',
        currentPage:page,
        hasNextPage:ITEMS_PER_PAGE*page<totalItems,
        hasPreviousPage:page>1,
        nextPage:page+1,
        previousPage:page-1,
        lastPage: Math.ceil(totalItems/ITEMS_PER_PAGE)
          /*,
      hasProducts: products.length > 0,
         activeShop : true , productCSS:true */  });
  })
  .catch(err=>{console.log(err);});
    
//  Product.findAll().then(products=>{
//   console.log('products fetched'); 
//   res.render('shop/index',{
//       prods:products ,
//         pageTitle:'Shop',path:'/'  /*,
//       hasProducts: products.length > 0,
//          activeShop : true , productCSS:true */  });

//  })
//  .catch(err=>{console.log(err);});
 
 
 
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
 
   req.user
   .populate('cart.items.productId')
   .execPopulate()
   .then(user=>{
     console.log(user.cart.items);
     const products=user.cart.items;
    res.render('shop/cart',{path:'/cart',
             pageTitle:'Your Cart',
             products: products,
             isAuthenticated:req.session.isLoggedIn
           });
   })
   .catch(err=>{console.log(err);});



  //Using Mongodb  return req.user.getCart()
  //  .then(products=>{
  //   res.render('shop/cart',{path:'/cart',
  //          pageTitle:'Your Cart',
  //          products: products
  //        });
  //  })
  //  .catch(err=>{console.log(err);});


// USING SEQUELIZE req.user.getCart()
// .then(cart=>{
//     return cart.getProducts().then(products=>{
//       res.render('shop/cart',{path:'/cart',
//        pageTitle:'Your Cart',
//        products: products
//      });
//     })
//     .catch(err=>{console.log(err);});  
//   //console.log(cart);
// })
// .catch(err=>{console.log(err);});
//   // Cart.getCart(cart=>{
//   //   Product.fetchAll(products=>{
//   //    const cartProducts=[];
//   //    for(let prod of products)
//   //    {
//   //      const cartProductData=cart.products.find(p=>p.id===prod.id);
//   //      if(cartProductData)
//   //      {
//   //        cartProducts.push({productData:prod, qty: cartProductData.qty});
//   //      }

//   //    }    
  
//   //     res.render('shop/cart',{path:'/cart',
//   //     pageTitle:'Your Cart',
//   //     products: cartProducts
//   //   });

//   //   });
    
    
  
//   // });

  
};

exports.postCart=(req,res,next)=>{

 const prodId= req.body.productId;
 Product.findById(prodId)
 .then(product=>{
    return req.user.addToCart(product)
    .then(result=>{
      console.log(result);
      res.redirect('/products');
      //res.redirect('/cart');
    })
    .catch(err=>{console.log(err);});
 })
 .catch(err=>{console.log(err);
  const error=new Error(err);
      error.httpStatusCode=500;
      return next(error);
});
//  let fetchedCart;
//   let newQuantity = 1;
//  req.user
//  .getCart()
//  .then(cart=>{
//    fetchedCart=cart
//    return fetchedCart.getProducts({where:{id:prodId}});
//  })
//  .then(products=>{
//   let product; 
//   if(products.length>0)
//    {product=products[0];
//    }
//    if(product)
//    {
//      const oldQuantity=product.cartItem.quantity;
//      newQuantity=oldQuantity+1;
//      return product;}
//     // return fetchedCart.addProduct(product,{through:{quantity:newQuantity}});
      
   
//    return Product.findByPk(prodId);
//  }).then(product=>{
//   return fetchedCart.addProduct(product,{through:{quantity:newQuantity}});
//  })
  
//   .then(()=>{
//      res.redirect('/cart');
//    })
//    .catch(err=>{console.log(err);});

  
//  //  Product.findById(prodId,(product)=>{
// //    Cart.addProduct(prodId,product.price);


// //  });
// //  res.redirect('/cart');

};

exports.postCartDeleteProduct=(req,res,next)=>{

   const prodId=req.body.productId;
   Product.findById(prodId)
   .then(product=>{
     console.log(product);
     return req.user.deleteCartItem(product).
     then(result=>{
       console.log(result);
      res.redirect('/cart');
     })
     .catch(err=>{console.log(err);});
   })
   .catch(err=>{console.log(err);
    const error=new Error(err);
      error.httpStatusCode=500;
      return next(error);
  });;
//   req.user.getCart()
//   .then(cart=>{
//     return cart.getProducts({where:{id:prodId}})
//   })
//   .then(products=>{
//     const product=products[0];
//     return product.cartItem.destroy();
//   })
//   .then(result=>{
//     res.redirect('/cart');

//   })

//   .catch(err=>{console.log(err);});

//   // Product.findById(prodId,(prod)=>{ 
     
//   //   Cart.deleteProduct(prodId,prod.price);
//   //   res.redirect('/cart');

//   // });
};
exports.getCheckout=(req,res,next)=>{
  let products;
  let totalSum=0;
  req.user
   .populate('cart.items.productId')
   .execPopulate()
   .then(user=>{
     products=user.cart.items;
     
    products.forEach(p=>{
      totalSum+=p.productId.price*p.quantity;
    }); 
     //console.log(user.cart.items);
     return stripe.checkout.sessions.create({
      payment_method_types:['card'],
      line_items: products.map(p=>{
        return {
          name:p.productId.title,
          description:p.productId.description,
          amount:p.productId.price*100,
          currency:'usd',
          quantity:p.quantity
        };
      }),
      success_url: req.protocol+'://'+req.get('host')+'/checkout/success',// => http://localhost:3000
      cancel_url:  req.protocol+'://'+req.get('host')+'/checkout/cancel'
     });
  }) 
     .then(session=>{
       
      res.render('shop/checkout',{path:'/checkout',
      pageTitle:'Checkout',
      products: products,
      totalSum: totalSum,
      sessionId:session.id
     });
     })
.catch(err=>{
  console.log(err);
  // const error=new Error(err);
  // error.httpStatusCode=500;
  // return next(error);
});

    

};

exports.getCheckoutSuccess=(req,res,next)=>{
  /*mongoose version*/
  /*Same as postOrder Controller */
  req.user
  .populate('cart.items.productId')
     .execPopulate()
     .then(user=>{
       const products=user.cart.items.map(i=>{
         return {product:{...i.productId._doc},quantity:i.quantity}
       });
      const order=new Order({
      products:products,
    user:{
      email:req.user.email,
      userId:req.user
    }});
    return order.save();
  })
  .then(result=>{
    req.user.clearCart()
    .then(result=>{
      res.redirect('/orders');
    });
    
  })
  .catch(err=>{console.log(err);
    const error=new Error(err);
        error.httpStatusCode=500;
        return next(error);
  });
}



exports.postOrder=(req,res,next)=>{
/*mongoose version*/
req.user
.populate('cart.items.productId')
   .execPopulate()
   .then(user=>{
     const products=user.cart.items.map(i=>{
       return {product:{...i.productId._doc},quantity:i.quantity}
     });
    const order=new Order({
    products:products,
  user:{
    email:req.user.email,
    userId:req.user
  }});
  return order.save();
})
.then(result=>{
  req.user.clearCart()
  .then(result=>{
    res.redirect('/orders');
  });
  
})
.catch(err=>{console.log(err);
  const error=new Error(err);
      error.httpStatusCode=500;
      return next(error);
})

// using mongodb req.user.addOrder()
// .then(result=>{
//   res.redirect('/orders');
// })
// .catch(err=>{console.log(err);});


//  USING SEQUELIZE   let fetchedCart;   
//      req.user.getCart()
//      .then(cart=>{
//          fetchedCart=cart;
//          return cart.getProducts();
//      })
//      .then(products=>{
//        return req.user.createOrder()
//        .then(order=>{
//          return order.addProducts(products.map(product=>{
//            product.orderItem={quantity:product.cartItem.quantity};
//            return product;
//          }));
//        })
//        .catch(err=>console.log(err));
//      })
//      .then(result => {
//       return fetchedCart.setProducts(null);
//     })
//     .then(result => {
//       res.redirect('/orders');
//     })
//     .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
     
  Order.find({'user.userId':req.user._id})
  .then(orders=>{
    console.log(orders);
    res.render('shop/orders', {
                  path: '/orders',
                  pageTitle: 'Your Orders',
                  orders: orders,
                  isAuthenticated:req.session.isLoggedIn
                });
    
  })
  .catch(err => console.log(err));
     
  
  // USing Mongodb req.user.getOrders()
      // .then(orders=>{
      //   res.render('shop/orders', {
      //             path: '/orders',
      //             pageTitle: 'Your Orders',
      //             orders: orders
      //           });
      // })
      // .catch(err => console.log(err));


  //   USING SEQUELIZEreq.user
//     .getOrders({include: ['products']})
//     .then(orders => {
//       console.log(orders);
//       res.render('shop/orders', {
//         path: '/orders',
//         pageTitle: 'Your Orders',
//         orders: orders
//       });
//     })
//     .catch(err => console.log(err));
};

// exports.getCheckout=(req,res,next)=>{

//     res.render('shop/checkout',{
//       path:'/checkout',
//       pageTitle:'Checkout'
//     });
// };
exports.getInvoice=(req,res,next)=>{
  const orderId=req.params.orderId;
  Order.findById(orderId)
  .then(order=>{
    if(!order){
      return next(new Error('No Order Found'));
    }
          if(order.user.userId.toString()!==req.user._id.toString())
      {
         return next(new Error('Unauthorized'));
      }
      const invoiceName='invoice-'+orderId+'.pdf';
      const invoicePath=path.join('data','invoices',invoiceName);
      res.setHeader('Content-Type','application/pdf');
      res.setHeader('Content-Disposition','inline; filename="'+invoiceName+'"'); 
      const pdfDoc=new PDFDocument();
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);
      
      pdfDoc.fontSize(26).text('Invoice',{
        underline:true
      });
       pdfDoc.text('--------------------------------------');
      let totalPrice=0;
      order.products.forEach(p=>{
        pdfDoc.fontSize(14).text(p.product.title+' - '+ p.quantity+' x '+ '$'+p.product.price);
        totalPrice+=p.product.price*p.quantity;
      });
      pdfDoc.text('--------------------------------------');
      pdfDoc.fontSize(20).text('Total =  $'+totalPrice);

      pdfDoc.end();
      // fs.readFile(invoicePath,(err,data)=>{
      //   if(err)
      //   {
      //     //console.log('Success!');
      //     return next(err);}
      //   else{
      //     console.log('Success!');
      //     res.setHeader('Content-Type','application/pdf');
      //      res.setHeader('Content-Disposition','inline; filename="'+invoiceName+'"'); 
      //      res.send(data);}
    
      // });
      // const file=fs.createReadStream(invoicePath);
    
      // file.pipe(res);
  })
  .catch(err=>next(err));
 
};
