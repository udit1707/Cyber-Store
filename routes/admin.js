const express=require('express');
// for html files const path=require('path');
const router=express.Router();
//leaner way of using path.join when sending htmlFiles const rootDir =require('../util/path');
const products=[];
const adminController=require('../controllers/admin');

// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);

// /admin/products => GET
router.get('/products',adminController.getProducts);

// /admin/add-product => POST    
router.post('/add-product',adminController.postAddProduct);
// exports.products=products;
// exports.routes=router;
module.exports=router;