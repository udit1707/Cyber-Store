const express=require('express');
//const path=require('path');
const router=express.Router();
//const rootDir =require('../util/path');
//const adminData=require('./admin');
const ratingController=require('../controllers/rating');
const isAuth=require('../middleware/is-auth');


router.post('/products/:productId/ratings',isAuth,ratingController.postRatings);

router.get('/tocsv',ratingController.toCSV);

router.get('/',ratingController.fetchIndex);

module.exports=router;