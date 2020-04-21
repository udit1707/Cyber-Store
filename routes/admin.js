const express=require('express');
// for html files const path=require('path');
const router=express.Router();
//leaner way of using path.join when sending htmlFiles const rootDir =require('../util/path');
const products=[];
const adminController=require('../controllers/admin');
const isAuth=require('../middleware/is-auth');

// /admin/add-product => GET
router.get('/add-product', isAuth,adminController.getAddProduct);

// // /admin/products => GET
router.get('/products',isAuth,adminController.getProducts);

// // /admin/add-product => POST    
router.post('/add-product',isAuth,adminController.postAddProduct);

router.get('/edit-product/:productId',isAuth,adminController.getEditProduct);

router.post('/edit-product',isAuth,adminController.postEditProduct);

router.post('/delete-product',isAuth,adminController.postDeleteProduct);

// exports.products=products;
// exports.routes=router;
module.exports=router;