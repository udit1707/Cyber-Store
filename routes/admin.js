const express=require('express');
// for html files const path=require('path');
const router=express.Router();
const{check,body} =require('express-validator');

//leaner way of using path.join when sending htmlFiles const rootDir =require('../util/path');
const products=[];
const adminController=require('../controllers/admin');
const isAuth=require('../middleware/is-auth');

// /admin/add-product => GET
router.get('/add-product', isAuth,adminController.getAddProduct);

// // /admin/products => GET
router.get('/products',isAuth,adminController.getProducts);

// // /admin/add-product => POST    
router.post('/add-product',[check('title','Title can only contain alphabhets and numbers and minimum 3 characters').isString().isLength({min:3}).trim(),
check('price')
.isFloat().
withMessage('Enter a valid Price'),
check('description')
.isString()
.isLength({min:5,max:400})
.withMessage('The description should contain aleast 5 characters and atmost 400')
],isAuth,adminController.postAddProduct);

router.get('/edit-product/:productId',isAuth,adminController.getEditProduct);

router.post('/edit-product',[check('title','Title can only contain alphabhets and numbers and minimum 3 characters').isString().isLength({min:3}).trim(),
check('price')
.isFloat().
withMessage('Enter a valid Price'),
check('description')
.isString()
.isLength({min:5,max:400})
.withMessage('The description should contain atleast 5 characters and atmost 400')
],isAuth,adminController.postEditProduct);

router.post('/delete-product',isAuth,adminController.postDeleteProduct);

// exports.products=products;
// exports.routes=router;
module.exports=router;