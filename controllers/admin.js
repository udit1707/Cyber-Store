const Product=require('../models/product');
exports.getAddProduct=(req,res, next)=>{
  
    // res.sendFile(path.join(rootDir,'views','add-product.html'));
     res.render('admin/add-product',{pageTitle:'Add Product',path:'/admin/add-product',activeAddProduct:true, formsCSS:true, productCSS:true});  
   };

exports.postAddProduct=   (req,res,next)=>{
    const title=req.body.title;
    const imageUrl=req.body.imageUrl;
    const price=req.body.price;
    const description=req.body.description;
    const product=new Product(title,imageUrl,price,description);
    product.save();
   // products.push({title:req.body.title});      
    res.redirect('/');;
  }

exports.getProducts=(req,res,next)=>{

       
  Product.fetchAll((products)=>{
    res.render('admin/products',{
      prods:products ,
       pageTitle:'Admin Products',path:'/admin/products'  /*,
       hasProducts: products.length > 0,
      activeShop : true , productCSS:true */  });

}) ;

}