const Product=require('../models/product');
const ProductSq=require('../modelsSQL/product');
const USER=require('../modelsSQL/user');
const AWS = require('aws-sdk');
AWS.config.update({region: process.env.REGION});
const fs = require('fs');
const path = require('path');
const fileHelper=require('../util/file');
const {validationResult}=require('express-validator/check');
const ITEMS_PER_PAGE=4;
const ID = process.env.AWS_ID;
const SECRET = process.env.AWS_KEY;
const BUCKET_NAME = process.env.BUCKET_NAME;
const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  accessKeyId: ID,
  secretAccessKey: SECRET
});

exports.getAddProduct=(req,res, next)=>{
  
    // res.sendFile(path.join(rootDir,'views','add-product.html'));
    console.log(req.session.isLoggedIn);
    res.render('admin/edit-product',{pageTitle:'Add Product',path:'/admin/add-product'
     ,editing:false,
     errorMessage:null,

      isAuthenticated:req.session.isLoggedIn,
      hasError:false,
      validationErrors:[]
    });  
   
    };

exports.postAddProduct=async(req,res,next)=>{
  console.log(req.session.isLoggedIn);
    if(!req.file){
      // return res.status(422).render(
      //   'admin/edit-product',{pageTitle:'Add Product'
      //   ,path:'/admin/add-product'
      //   ,editing:false, 
      //   hasError:true,
      //   errorMessage:'Attached file is not supported',
    
      //   isAuthenticated:req.session.isLoggedIn,
      //   product:{title:req.body.title,price:req.body.price,description:req.body.description}, 
      //   validationErrors:[]
      // }
      // );
      console.log("No file");
    }
    
    const errors=validationResult(req);

    if(!errors.isEmpty()){
  // return res.status(422).render(
  //   'admin/edit-product',{pageTitle:'Add Product'
  //   ,path:'/admin/add-product'
  //   ,editing:false, 
  //   hasError:true,
  //   errorMessage:errors.array()[0].msg,

  //   isAuthenticated:req.session.isLoggedIn,
  //   product:{title:title,price:price,description:description}, 
  //   validationErrors:errors.array()} 

  // );
  console.log(errors.array());
}
  const filePath = path.join(__dirname, '..', req.file.path);
  const imgContent = fs.createReadStream(filePath);
  const params = {
    Bucket: BUCKET_NAME,Key: req.body.title, // File name you want to save as in S3
    Body: imgContent
  };
  let postAWS;
  try{
    const products=await Product.find({'title':req.body.title});
    if(products.length>0)
    {
      return res.status(422).render(
        'admin/edit-product',{pageTitle:'Add Product'
        ,path:'/admin/add-product'
        ,editing:false, 
        hasError:true,
        errorMessage:'Product Title Already Exists',    
        isAuthenticated:req.session.isLoggedIn,
        product:{title:req.body.title,price:req.body.price,description:req.body.description}, 
        validationErrors:[]
      }
      );
    }
    postAWS=await s3.upload(params).promise();
  }
  catch(err)
  {
    throw err;
  }
  try{
    const title=req.body.title;
    const price=req.body.price;
    const description=req.body.description;
    const imageUrl=postAWS.Location;
    const product=new Product({title:title,price:price,imageUrl:imageUrl,description:description,
      userId:req.user //optional
      //userId:req.user mongoose version it automatically picks up user._id using req.user 
    });
    
    const result=await product.save();
    const SqlUSER=await USER.findOne({where:{mongoId:req.user._id.toString()}});
    // console.log(SqlUSER);
    const productSql=await SqlUSER.createProduct({name:req.body.title,image:postAWS.Location,mongoId:result._id.toString()}); 
    clearImage(req.file.path);
    res.redirect('/admin/products');
  }
  catch(err){
      // return res.status(500).render(
      //   'admin/edit-product',{pageTitle:'Add Product'
      //   ,path:'/admin/add-product'
      //   ,editing:false, 
      //   hasError:true,
      //   errorMessage:'Database Operation failed, please try again. ',
    
      //   isAuthenticated:req.session.isLoggedIn,
      //   product:{title:title,imageUrl:imageUrl,price:price,description:description}, 
      //   validationErrors:[]} 
      console.log(err);
      const error=new Error(err);
      error.httpStatusCode=500;
      return next(error);
      
    }
  // using SEQUELIZE in mysql  
  //   req.user.createProduct({
  //     title:title,
  //     price:price,
  //     imageUrl:imageUrl,
  //     description:description
  //   })
  //   .then(result=>{console.log('Prodct Added');
  
  //   res.redirect('/admin/products');

  // })
  //   .catch(err=>{console.log(err);});    
    
    // using database mysql 
    //const product=new Product(null,title,imageUrl,price,description);
    // product.save()
    // .then(()=>{res.redirect('/');})
    // .catch(err=>{console.log(err);});
   // products.push({title:req.body.title});      
    
  };

   exports.getEditProduct=(req,res, next)=>{
  
//     // res.sendFile(path.join(rootDir,'views','add-product.html'));
    const editMode= req.query.edit;  
    if(!editMode)
    {
      return res.redirect('/');
    }
    const prodId=req.params.productId;

    Product.findById(prodId)
    .then(product=>{
      if(!product)
            {
              return res.redirect('/');
            }
            res.render('admin/edit-product',
           {pageTitle:'Edit Product',
           path:'/admin/edit-product',
           editing: editMode,
           hasError:false,
           product:product,
           isAuthenticated:req.session.isLoggedIn,
           errorMessage:null,
           validationErrors:[]
          
          });
    })
    .catch(err=>{console.log(err);});
//   using sequelize  req.user.getProducts({where:{id:prodId}})
//     //Product.findByPk(prodId)
//     .then(products=>
//       {const product=products[0];
//       if(!product)
//       {
//         return res.redirect('/');
//       }
//       res.render('admin/edit-product',
//      {pageTitle:'Edit Product',
//      path:'/admin/edit-product',
//      editing: editMode,
//      product:product
    
//     });})
//     .catch(err=>{console.log(err);});
   


//     // Product.findById(prodId,product=>{
//     //   if(!product)
//     //   {
//     //     return res.redirect('/');
//     //   }
//     //   res.render('admin/edit-product',
//     //  {pageTitle:'Edit Product',
//     //  path:'/admin/edit-product',
//     //  editing: editMode,
//     //  product:product
    
//     // });  
//     // });
 };
 exports.postEditProduct=async(req,res,next)=>{
        
     const prodId=req.body.productId;
     const updatedTitle=req.body.title;
     const updatedPrice=req.body.price;
     const updatedImage=req.file;
     const updatedDesc=req.body.description;
    let imageUrl;
     
     const errors=validationResult(req);
 
    if(!errors.isEmpty())
    {
      return res.status(422).render('admin/edit-product',{pageTitle:'Edit Product',path:'/admin/edit-product',editing:true,
      hasError:true,errorMessage:errors.array()[0].msg,
      isAuthenticated:req.session.isLoggedIn,product:{_id:prodId,title:updatedTitle,price:updatedPrice,description:updatedDesc},
      validationErrors:errors.array()});
    }     
    try{
      const product=await Product.findById(prodId);
      if(product.userId.toString()!==req.user._id.toString())
      {
        return res.redirect('/');
      }
      if(!updatedImage)
      {
          imageUrl=product.imageUrl;
      }
      else
      {
         //Deleting previous s3 bucket image
        try
        {
            if(product.title!=updatedTitle)
            {
            const exist = await s3.headObject({Bucket:BUCKET_NAME,Key: product.title}).promise().then(()=>true,err=>{
            if(err.code==='NotFound'){return false;}throw err;
            });            
            if(exist)
            {const del=await s3.deleteObject({   Bucket: BUCKET_NAME,Key: product.title }).promise();}
            }
        }
        catch(err){throw err;}
  
        //uploading latest s3 bucket image
        const filePath = path.join(__dirname, '..', req.file.path);
        const imgContent = fs.createReadStream(filePath);
        const params = {Bucket: BUCKET_NAME,Key: req.body.title, // File name you want to save as in S3
            Body: imgContent};
        let postAWS;
        try
        {
          const products=await Product.find({'title':req.body.title});
          if(products.length>0&&req.body.title!=product.title)
          {
            return res.status(422).render('admin/edit-product',{pageTitle:'Edit Product',path:'/admin/edit-product'
              ,editing:true, 
              hasError:true,
              errorMessage:'Product Title Already Exists',    
              isAuthenticated:req.session.isLoggedIn,
              product:{_id:prodId,title:updatetdTitle,price:updatedPrice,description:updatedDesc}, 
              validationErrors:[]});
          }
          postAWS=await s3.upload(params).promise();
        }
        catch(err)
        {
          throw err;
        }
        imageUrl=postAWS.Location;
      }  
       product.title=updatedTitle;
       product.price=updatedPrice;
       product.imageUrl=imageUrl;
       product.description=updatedDesc;
       const result=await product.save();
       const prodS=await ProductSq.findOne({where:{mongoId:result._id.toString()}});
       prodS.name=updatedTitle;
       prodS.image=imageUrl;
       await prodS.save();
       res.redirect('/admin/products'); 
    }
    catch(err){
            console.log(err);
            const error=new Error(err);
      error.httpStatusCode=500;
      return next(error);
    }
     // USING MONGODB const updatedProd=new Product(updatetdTitle,updatedPrice,updatedImageUrl,updatedDesc,new ObjectId(prodId));
    //  updatedProd.save()
    //  .then(result=>{console.log('UPDATED PRODUCT');
    //         res.redirect('/admin/products');
    //       })
    //       .catch(err=>{console.log(err);});


        //   USING MYSQL SEQUELIZE   Product.findByPk(prodId)
//      .then(product=>{
//        product.title=updatetdTitle;
//        product.price=updatedPrice;
//        product.imageUrl=updatedImageUrl;
//        product.description=updatedDesc;
//        return product.save();
//      })
//      .then(result=>{
//        console.log('UPDATED PRODUCT');
//        res.redirect('/admin/products');
//      })
//      .catch(err=>{console.log(err);});
//     //  updatedProd.save();
//     //  res.redirect('/admin/products');
};


exports.getProducts=(req,res,next)=>{


  const page=+req.query.page||1;
  let totalItems;
  Product.find({userId:req.user._id}).countDocuments().then(numProducts=>{
   totalItems=numProducts;
   return Product.find()
   .skip((page-1)* ITEMS_PER_PAGE)
   .limit(ITEMS_PER_PAGE); 
 })    
   // .select('title price -_id')
   // .populate('userId','name')
   .then(products=>{
    res.render('admin/products',{
              prods:products ,
              pageTitle:'Admin Products',path:'/admin/products',
              isAuthenticated:req.session.isLoggedIn,
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


//   req.user.
//   getProducts()

//   //Product.findAll()
//   .then (products=>{
//     console.log('admin products fetched'); 
//     res.render('admin/products',{
//         prods:products ,
//         pageTitle:'Admin Products',path:'/admin/products'  /*,
//         hasProducts: products.length > 0,
//        activeShop : true , productCSS:true */  });
  
//    })
//    .catch(err=>{console.log(err);});
       
//   Product.fetchAll((products)=>{
//     res.render('admin/products',{
//       prods:products ,
//        pageTitle:'Admin Products',path:'/admin/products'  /*,
//        hasProducts: products.length > 0,
//       activeShop : true , productCSS:true */  });

// }) ;

 }

  exports.deleteProduct=async(req,res,next)=>{
  try{
  const prodId=req.params.productId;
  const product=await Product.findById(prodId);
  if(!product)
  {
    return next(new Error('Product not found!'));
  }
  const params = {   Bucket: BUCKET_NAME,Key: product.title };
    try{
    const del=await s3.deleteObject(params).promise(); 
    }
    catch(err)
    {
      throw err;
    } 
  const result=await Product.deleteOne({_id:prodId,userId:req.user._id});
  const prodS=await ProductSq.destroy({where:{mongoId:product._id.toString()}});
  //console.log('DESTROYED PRODUCT');
  //res.redirect('/admin/products');
  res.status(200).json({message:'Success!'});
  }
  catch(err){
      // console.log(err);
      // const error=new Error(err);
      // error.httpStatusCode=500;
      // return next(error);
      res.status(500).json({message:'Deleting product failed.'});
  }
  
    // USING MONGODB  Product.deleteById(prodId)
  //   .then((result=>{ res.redirect('/admin/products');}))
  //   .catch(err=>{console.log(err);});
  // }

//  using SEQUELIZE 
//   Product.findByPk(prodId)
//   .then(product=>{
//     return product.destroy();
//   })
//   .then(result=>{
//     console.log('Destroyed Product');
//     res.redirect('/admin/products');
//   })
//   .catch(err=>{
//     console.log(err);
//   });
 

//   // Product.deleteById(prodId);
//   // res.redirect('/admin/products');

}
const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};

