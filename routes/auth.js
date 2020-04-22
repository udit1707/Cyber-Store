const express=require('express');
const router=express.Router();
const User=require('../models/user');
const{check,body} =require('express-validator');
const authController=require('../controllers/auth');
router.get('/login',authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login',[check('email').
isEmail()
.withMessage('Please enter a valid email')
.normalizeEmail()
,body('password','Please enter a valid password that is alphanumeric and atleast 5 characters').
isLength({min:5})
.isAlphanumeric()
.trim()],authController.postLogin);

router.post('/signup',[
    check('email')
     .isEmail()
     .withMessage('Please enter a valid Email.')
     .custom((value,{req})=>{
    // if(value==='test@test.com')
    // throw new Error('This email address is forbidden');
    // return true;
     return User.findOne({email:value}).then(userDoc=>{
      if(userDoc) {
          return Promise.reject('Email already exists, please pick a a different one');
        };
        });
    })  
    .normalizeEmail()  
,body('password','Please enter a password with only numbers and text and at least 5 character.')
.isLength({min:5})
.isAlphanumeric()
.trim()
,body('confirmPassword')
.trim()
.custom((value,{req})=>{
    if(value!==req.body.password)
    {
        throw new Error('Passwords have to macth')
    }
    return true;
})
], authController.postSignup);

router.post('/logout',authController.postLogout);

router.get('/reset',authController.getReset);

router.post('/reset',authController.postReset);

router.get('/reset/:token',authController.getNewPassword);

router.post('/new-password',authController.postNewPassword);
module.exports=router;