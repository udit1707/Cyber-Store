//const http = require('http');
// function rqListener(req,res){
const express=require('express'); 
const bodyParser=require('body-parser');
const app=express();
const path=require('path');
const errorController=require('./controllers/error');



/*
to use handlebars as template engine

const expressHbs=require('express-handlebars');
app.engine('hbs',expressHbs({layoutsDir:'views/layouts/', defaultLayout:'main-layout', extname:'hbs'}));
app.set('view engine','hbs');*/

//to use pug as an template engine app.set('view engine','pug');
app.set('view engine','ejs');
app.set('views', 'views');

const adminRoutes=require('./routes/admin');
const shopRoutes=require('./routes/shop');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

app.use('/admin',adminRoutes);

app.use(shopRoutes);

app.use(errorController.getErrorPage);



// }
// http.createServer(rqListener);
//we can also use an alternative syntax for sending/receiving server requests.


/*Alternative is given below using 'app'.
 const server=http.createServer(app);
 server.listen(3001); alternative line 
*/
app.listen(3005);