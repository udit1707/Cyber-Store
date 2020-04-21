const bcrypt=require('bcryptjs');

const User=require('../models/user');
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
                    errorMessage:message
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
                    errorMessage:message
                  });
                };    

 exports.postLogin=(req,res,next)=>{
/* Adding Auth by email */
const email=req.body.email;
const password=req.body.password;
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
      req.flash('error','Invalid email or password');    
     res.redirect('/login');
  })
    .catch(err=>{return res.redirect('/login')});
  
})
.catch(err=>{console.log(err);});



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
 exports.postSignup = (req, res, next) => {
     const email=req.body.email;
     const password=req.body.password;
     const confirmPassword=req.body.confirmPassword;
     
     User.findOne({email:email})
     .then(userDoc=>{
       if(!userDoc){
         return bcrypt.hash(password,12)
         .then(hashedPassword=>{
                
          const user=new User({
            email:email,
            password:hashedPassword,
            cart:{items:[]}
          });
          user.save()
          .then(result=>{
            res.redirect('/login');
          })
          .catch(err=>{console.log(err);});
 
         });
         
        
       }
       else
       {req.flash('error','Email EXISTS!!');
         return res.redirect('/signup');}
     })
     .catch(err=>{console.log(err);});

 };


 exports.postLogout=(req,res,next)=>{
   req.session.destroy((err)=>{
     console.log(err);
     res.redirect('/');

   })
 }               


