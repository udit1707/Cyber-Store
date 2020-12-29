const express=require('express');
//const path=require('path');
const router=express.Router();
//const rootDir =require('../util/path');
//const adminData=require('./admin');
const shopController=require('../controllers/shop');
const isAuth=require('../middleware/is-auth');

// router.get('/', shopController.getIndex );
router.get('/products', shopController.getProducts );

router.get('/products/:productId',shopController.getProduct);

router.get('/cart',isAuth, shopController.getCart);

router.post('/cart',isAuth,shopController.postCart);
router.post('/cart-delete-item',isAuth,shopController.postCartDeleteProduct);

router.get('/checkout',isAuth,shopController.getCheckout);
router.get('/checkout/success',isAuth,shopController.getCheckoutSuccess);
router.get('/checkout/cancel',isAuth,shopController.getCheckout);

// router.get('/checkout',shopController.getCheckout);
router.get('/order/:orderId',isAuth,shopController.getInvoice);

router.get('/orders',isAuth,shopController.getOrders);

module.exports=router;