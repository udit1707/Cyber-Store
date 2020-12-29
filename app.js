
require('dotenv').config();
const fs=require('fs');
const sequelize=require('./util/databaseSql');
const Product=require('./modelsSQL/product'),
ProductRating=require('./modelsSQL/product-rating'),
USER=require('./modelsSQL/user'),
Rating=require('./modelsSQL/rating');
const MONGODB_URI=process.env.MONGODB_URI;
const express=require('express'); 
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const session=require('express-session');
const MongoDBStore=require('connect-mongodb-session')(session);
const csrf=require('csurf');
const app=express();
const flash=require('connect-flash');
const store=new MongoDBStore({
    uri:MONGODB_URI,
    collection:'sessions'
});
const path=require('path');
const errorController=require('./controllers/error');
// const mongoConnect=require('./util/database').mongoConnect;
const User=require('./models/user');
const helmet=require('helmet');
const compression=require('compression');
const morgan=require('morgan');
const multer=require('multer');

/* SQL IMPORTS

//Non-SEQUELIZE const db=require('./util/database');

const sequelize=require('./util/database');
const Product=require('./models/product');
const User=require('./models/user');
const Cart=require('./models/cart');
const CartItem=require('./models/cart-item');
const Order=require('./models/order');
const OrderItem=require('./models/order-item');


to use handlebars as template engine

const expressHbs=require('express-handlebars');
app.engine('hbs',expressHbs({layoutsDir:'views/layouts/', defaultLayout:'main-layout', extname:'hbs'}));
app.set('view engine','hbs');*/

//to use pug as an template engine app.set('view engine','pug');
const csrfProtection=csrf();

// const privateKey=fs.readFileSync('serverkey');
// const certificate=fs.readFileSync('server.cert');

const fileStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        fs.exists(path.join(__dirname+'/ImageImport'),exists=>{
            if(!exists)
            {
              fs.mkdir(path.join(__dirname+'/ImageImport'),err=>{
                if(err)
                {
                  res.status(404).json({message:"Folder creation failed"});
                }
             });
            }
            cb(null,'ImageImport');
          });
    } ,
    filename:(req,file,cb)=>{ 
        cb(null,new Date().toISOString()+'_'+file.originalname);
    }
});

const fileFilter=(req,file,cb)=>{
   if(file.mimetype==='image/png' || file.mimetype==='image/jpg' || file.mimetype==='image/jpeg')
    {cb(null,true);}
    else{
      cb(null,false);
    }
};

app.set('view engine','ejs');
app.set('views', 'views');

const adminRoutes=require('./routes/admin');
const shopRoutes=require('./routes/shop');
const authRoutes=require('./routes/auth');
const ratingRoutes=require('./routes/ratings');

//testing mysql code.
//db.execute('SELECT * FROM products')
// .then((result)=>{
//     console.log(result[0],result[1]);
// })
// .catch((err)=>{console.log(err);});
const accessLogStream=fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'});

app.use(helmet());
app.use(compression());
app.use(morgan('combined',{stream:accessLogStream}));

app.use(bodyParser.urlencoded({extended:true})); 
app.use(multer({storage:fileStorage, fileFilter:fileFilter}).single('image'));
app.use(express.static(path.join(__dirname,'public')));
app.use('/images',express.static(path.join(__dirname,'images')));


app.use(session({secret:'my secret'
,resave:false
,saveUninitialized:false
,store:store
}));
app.use(csrfProtection);
app.use(flash());

app.use((req,res,next)=>{
    res.locals.isAuthenticated=req.session.isLoggedIn;
    res.locals.csrfToken=req.csrfToken();
    next();
});
app.use((req,res,next)=>{
    if(!req.session.user){
        return next();
    }
    User.findById(req.session.user._id)
    .then(user=>{
        // console.log('USer Found');
        // console.log(user);
        //mongodb  req.user=new User(user.name,user.email,user.cart,user._id);
        /*mongoose*/ 
        if(!user){
            return next();
        }
        req.user=user;
        next();
    })
    .catch(err=>{
         //throw new Error(err);this won't jumpo to error handling middleware inside an async function
         next(new Error(err));
        // console.log(err);
    });
   
});


app.use('/admin',adminRoutes);

app.use(shopRoutes);
app.use(ratingRoutes);
app.use(authRoutes);
app.use('/500',errorController.get500);
app.use(errorController.get404);

Product.belongsTo(USER,{constraints:true,onDelete:'CASCADE'});
USER.hasMany(Product);
Product.belongsToMany(Rating,{through:ProductRating});
USER.hasMany(ProductRating);

// }
// http.createServer(rqListener);
//we can also use an alternative syntax for sending/receiving server requests.


/*Alternative is given below using 'app'.
 const server=http.createServer(app);
 server.listen(3001); alternative line */
 app.use((error,req,res,next)=>{
    // res.status(error.httpStatusCode).render(...);
     //res.redriect('/500');
     console.log(error);
     res.status(500).render('500',{pageTitle:'Error500',path:'/500'});

 });

mongoose.connect(MONGODB_URI)
.then((result)=>{
    sequelize.
    //sync({force:true}).
    sync().
    then(result=>{
     console.log(result);
     app.listen(process.env.PORT || 3000);
    });

    // User.findOne().then(user=>{
    //     if(!user){
    //         const user=new User({
    //             email:'udittest@gmail.com',
    //             password:'abcdef',
    //             cart:{items:[]}
    //         });
    //         user.save();
    //      }
    // });  
    // https
    // .createServer({key:privateKey,cert:certificate},app)
    // .listen(process.env.PORT || 3000 );
})
.catch(err=>{
    console.log(err);
});

//  mongoConnect(()=>{
//       app.listen(3005);
//  });

 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 /* MYSQL using SEQUELIZE DATABASE IMPLEMENTATION */

// Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
// /*optional line just to make things more clear*/
// User.hasMany(Product);

// User.hasOne(Cart);
// /*optional line just to make things more clear*/
// Cart.belongsTo(User);

// Cart.belongsToMany(Product, { through: CartItem });
// //Many-Many Relationship here b/w cart and product
// /*optional line just to make things more clear*/
// Product.belongsToMany(Cart, { through: CartItem });

// Order.belongsTo(User);
// User.hasMany(Order);

// Order.belongsToMany(Product, { through: OrderItem });


//  sequelize.
//  //sync({force:true}).
//  sync().
//  then(result=>{
//      return User.findByPk(1);  })
//  .then(user=>{
//      if(!user){
//         return User.create({name:'Udit',email:'udittest@gmail.com'});
//      }
//      return user;//returning a value in 'then' block is automatically wrapped into a new promise.
//  })
//  .then(user=>{
//      //console.log(user);
//      return user.createCart();
     

//  })
//  .then((cart)=>{app.listen(3005);}) 
//  //console.log(result);
//     .catch(err=>{console.log(err);}); 
