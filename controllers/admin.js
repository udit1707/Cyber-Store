const Product=require('../models/product');
exports.getAddProduct=(req,res, next)=>{
  
    // res.sendFile(path.join(rootDir,'views','add-product.html'));
     res.render('admin/edit-product',{pageTitle:'Add Product',path:'/admin/add-product',editing:false});  
   };

exports.postAddProduct=   (req,res,next)=>{
    const title=req.body.title;
    const imageUrl=req.body.imageUrl;
    const price=req.body.price;
    const description=req.body.description;
    req.user.createProduct({
      title:title,
      price:price,
      imageUrl:imageUrl,
      description:description
    })
    .then(result=>{console.log('Prodct Added');
  
    res.redirect('/admin/products');

  })
    .catch(err=>{console.log(err);});
    
    
    
    // using database mysql 
    //const product=new Product(null,title,imageUrl,price,description);
    // product.save()
    // .then(()=>{res.redirect('/');})
    // .catch(err=>{console.log(err);});
   // products.push({title:req.body.title});      
    
  }

  exports.getEditProduct=(req,res, next)=>{
  
    // res.sendFile(path.join(rootDir,'views','add-product.html'));
    const editMode= req.query.edit;  
    if(!editMode)
    {
      return res.redirect('/');
    }
    const prodId=req.params.productId;
    req.user.getProducts({where:{id:prodId}})
    //Product.findByPk(prodId)
    .then(products=>
      {const product=products[0];
      if(!product)
      {
        return res.redirect('/');
      }
      res.render('admin/edit-product',
     {pageTitle:'Edit Product',
     path:'/admin/edit-product',
     editing: editMode,
     product:product
    
    });})
    .catch(err=>{console.log(err);});
   


    // Product.findById(prodId,product=>{
    //   if(!product)
    //   {
    //     return res.redirect('/');
    //   }
    //   res.render('admin/edit-product',
    //  {pageTitle:'Edit Product',
    //  path:'/admin/edit-product',
    //  editing: editMode,
    //  product:product
    
    // });  
    // });
 };
 exports.postEditProduct=(req,res,next)=>{
        
     const prodId=req.body.productId;
     const updatetdTitle=req.body.title;
     const updatedPrice=req.body.price;
     const updatedImageUrl=req.body.imageUrl;
     const updatedDesc=req.body.description;
     //const updatedProd=new Product(prodId,updatetdTitle,updatedImageUrl,updatePrice,updatedDesc);
     Product.findByPk(prodId)
     .then(product=>{
       product.title=updatetdTitle;
       product.price=updatedPrice;
       product.imageUrl=updatedImageUrl;
       product.description=updatedDesc;
       return product.save();
     })
     .then(result=>{
       console.log('UPDATED PRODUCT');
       res.redirect('/admin/products');
     })
     .catch(err=>{console.log(err);});
    //  updatedProd.save();
    //  res.redirect('/admin/products');
};


exports.getProducts=(req,res,next)=>{

  req.user.
  getProducts()

  //Product.findAll()
  .then (products=>{
    console.log('admin products fetched'); 
    res.render('admin/products',{
        prods:products ,
        pageTitle:'Admin Products',path:'/admin/products'  /*,
        hasProducts: products.length > 0,
       activeShop : true , productCSS:true */  });
  
   })
   .catch(err=>{console.log(err);});
       
//   Product.fetchAll((products)=>{
//     res.render('admin/products',{
//       prods:products ,
//        pageTitle:'Admin Products',path:'/admin/products'  /*,
//        hasProducts: products.length > 0,
//       activeShop : true , productCSS:true */  });

// }) ;

}

exports.postDeleteProduct=(req,res,next)=>{
 
  const prodId=req.body.productId;
  Product.findByPk(prodId)
  .then(product=>{
    return product.destroy();
  })
  .then(result=>{
    console.log('Destroyed Product');
    res.redirect('/admin/products');
  })
  .catch(err=>{
    console.log(err);
  });
 

  // Product.deleteById(prodId);
  // res.redirect('/admin/products');

}

