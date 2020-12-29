require('dotenv').config();
const crypto=require('crypto');
const bcrypt=require('bcryptjs');
const nodemailer=require('nodemailer');
const sendgridTransport=require('nodemailer-sendgrid-transport');
const {validationResult}=require('express-validator/check');
const User=require('../models/user');
const USER=require('../modelsSQL/user');
const transporter=nodemailer.createTransport(sendgridTransport({
  auth:{
    api_key: process.env.SENDGRID_KEY
    /*enter the api key*/
  }
}));
exports.getLogin = (req, res, next) => {
//    const isLoggedIn=req.get('Cookie').
//     trim()
//     .split('=')[1]==='true';
// console.log(req.session.isLoggedIn);
let message=req.flash('error');
if(message.length>0)
{
  message=message[0];
}
else
message=null;     
res.render('auth/login', {
                    path: '/login',
                    pageTitle: 'Login Page',
                    errorMessage:message,
                    oldInput:{email:"",password:""},
                    validationErrors:[]
                  });
                }
exports.getSignup = (req, res, next) => {
let message=req.flash('error');
if(message.length>0)
{
  message=message[0];
}
else
message=null;   
                  res.render('auth/signup', {
                    path: '/signup',
                    pageTitle: 'Signup',
                    errorMessage:message,
                    oldInput:{email:"",
                  pasword:"",
                confirmPassword:""},
                validationErrors:[]
                  });
                };    

 exports.postLogin=(req,res,next)=>{
/* Adding Auth by email */
const email=req.body.email;
const password=req.body.password;
const errors=validationResult(req);
if(!errors.isEmpty()){
  console.log(errors.array());
  return res.status(422).render('auth/login', {
   path: '/login',
   pageTitle: 'Login Page',
   errorMessage:errors.array()[0].msg,
   oldInput:{email:email,password:password},
   validationErrors:errors.array() 

  });
}
User.findOne({email:email})
.then(user=>{
  if(!user){
    req.flash('error','Invalid email or password');
    return res.redirect('/login');
  }
  bcrypt.compare(password,user.password)
  .then((doMatch)=>{
    if(doMatch)
    {
      req.session.isLoggedIn=true;
      req.session.user=user;
      return req.session.save(err=>{
                console.log(err);
                 res.redirect('/');
                });        
      }
      else{req.flash('error','Invalid email or password');    
      res.redirect('/login');}
  })
    .catch(err=>{return res.redirect('/login')});
  
})
.catch(err=>{console.log(err);
  const error=new Error(err);
      error.httpStatusCode=500;
      return next(error);
});



    //  // res.setHeader('Set-Cookie','loggedIn=true; HttpOnly');//Setting a cookie
    //  Dummy Auth using session  User.findById('5e9ef1728373d44764248d86')
    //   .then(user=>{
    //       // console.log('USer Found');
    //       // console.log(user);
    //       //mongodb  req.user=new User(user.name,user.email,user.cart,user._id);
    //       /*mongoose*/ 
    //       req.session.user=user;
    //       req.session.isLoggedIn=true;
    //       req.session.save(err=>{
    //         console.log(err);
    //         res.redirect('/');
        
    //       });
    //      })
    //   .catch(err=>{console.log(err);});
         
 }
 exports.postSignup = async(req, res, next) => {
     const email=req.body.email;
     const password=req.body.password;
     const confirmPassword=req.body.confirmPassword;
     const errors=validationResult(req);
     if(!errors.isEmpty()){
       console.log(errors.array());
       return res.status(422).render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage:errors.array()[0].msg,
        oldInput:{email:email,password:password,confirmPassword:confirmPassword},
        validationErrors:errors.array() 
       });
     }
     try{
        const hashedPassword=await bcrypt.hash(password,12);
        const user=new User({email:email,password:hashedPassword,cart:{items:[]}});
        const result=await user.save();
        const resultSQ=await USER.create({mongoId:result._id.toString(),email:result.email});
        res.redirect('/login');
        return transporter.sendMail({
              to: email,
              from:'uditsingh294@gmail.com',
              subject:'Signup Success',
              html:'<h1>Sign Up Successfull!!</h1>'
            });
      }          
     catch(err){console.log(err);
        const error=new Error(err);
      error.httpStatusCode=500;
      return next(error);
      };
 };

 exports.postLogout=(req,res,next)=>{
   req.session.destroy((err)=>{
     console.log(err);
     res.redirect('/');

   })
 }   
 
 exports.getReset=(req,res,next)=>{

  let message=req.flash('error');
if(message.length>0)
{
  message=message[0];
}
else
message=null;     
res.render('auth/reset', {
                    path: '/reset',
                    pageTitle: 'Pasword Reset Page',
                    errorMessage:message
                  });
};

exports.postReset=(req,res,next)=>{
  crypto.randomBytes(32,(err,buffer)=>{
    if(err){
      console.log(err);
      return res.redirect('/reset');
    }
    const token=buffer.toString('hex');
    User.findOne({email:req.body.email})
    .then(user=>{
      if(!user){
        req.flash('error','No account with that email found');
        return res.redirect('/reset');
      }
      user.resetToken=token;
      user.resetTokenExpiration=Date.now()+3600000;
      return user.save();
    })
    .then((result)=>{
      res.redirect('/');
      transporter.sendMail({
        to: req.body.email,
        from:'uditsingh294@gmail.com',
        subject:'Password Reset',
        html:`
        <p>You requested a password reset</p>
        <p>Click this <a href="https://cyber-store.herokuapp.com/reset/${token}">link</a> to set a new password</p>
        `    
       });          
    })
    .catch(err=>{console.log(err);
      const error=new Error(err);
      error.httpStatusCode=500;
      return next(error);
    });
  });

};
exports.getNewPassword=(req,res,next)=>{
  const token=req.params.token;
  User.findOne({resetToken:token,resetTokenExpiration:{$gt: Date.now()}})
  .then(user=>{
    let message=req.flash('error');
    if(message.length>0)
    {
      message=message[0];
    }
    else
    message=null;     
    res.render('auth/new-password', {
                        path: '/new-password',
                        pageTitle: 'New Password Page',
                        errorMessage:message,
                        userId:user._id.toString(),
                        passwordToken: token
                      });
  })
  .catch(err=>{
    console.log(err);
  });
 
  };

  exports.postNewPassword=(req,res,next)=>{
     const newPassword=req.body.password;
     const userId=req.body.userId;
     const passwordToken=req.body.passwordToken;
     let resetUser;
     User.findOne({resetToken:passwordToken
      ,resetTokenExpiration:{$gt: Date.now()}
      ,_id:userId})
     .then(
       user=>{
         resetUser=user;
         return bcrypt.hash(newPassword,12);})
         .then((hashedPassword)=>{
          resetUser.password=hashedPassword;
          resetUser.resetToken=undefined;
          resetUser.resetTokenExpiration=undefined;
           return resetUser.save();
         }) 
         .then(result=>{
           res.redirect('/login');
         })
         .catch(err=>{console.log(err);
          const error=new Error(err);
      error.httpStatusCode=500;
      return next(error);
        });
       
   
  };



   

 


