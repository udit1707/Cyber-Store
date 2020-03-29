exports.getErrorPage=(req,res,next)=>{
    //res.status(404).sendFile(path.join(__dirname,'views','404.html'));
      res.status(404).render('404',{pageTitle:'Error404',path:'sdsdnfj'});
  };