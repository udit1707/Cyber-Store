exports.get404=(req,res,next)=>{
    //res.status(404).sendFile(path.join(__dirname,'views','404.html'));
      res.status(404).render('404',{pageTitle:'Error404',path:'404Error', isAuthenticated:req.session.isLoggedIn});
  };
  exports.get500=(req,res,next)=>{
    //res.status(404).sendFile(path.join(__dirname,'views','404.html'));
      res.status(500).render('500',{pageTitle:'Error500',path:'/500'});
  };
