module.exports=(req,res,next)=>{
    console.log(req.session.isLoggedIn);
    if(!req.session.isLoggedIn)
    {   
        res.redirect('/');}
    else
    next();
};