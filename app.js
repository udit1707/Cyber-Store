//const http = require('http');
// function rqListener(req,res){
const express=require('express'); 
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const app=express();
const path=require('path');
const errorController=require('./controllers/error');
// const mongoConnect=require('./util/database').mongoConnect;
const User=require('./models/user');

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
app.set('view engine','ejs');
app.set('views', 'views');

const adminRoutes=require('./routes/admin');
const shopRoutes=require('./routes/shop');

//testing mysql code.
//db.execute('SELECT * FROM products')
// .then((result)=>{
//     console.log(result[0],result[1]);
// })
// .catch((err)=>{console.log(err);});

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.use((req,res,next)=>{
    User.findById('5e9c8e85d0920364edc38374')
    .then(user=>{
        // console.log('USer Found');
        // console.log(user);
        //mongodb  req.user=new User(user.name,user.email,user.cart,user._id);
        /*mongoose*/ 
        req.user=user;
        next();
    })
    .catch(err=>{console.log(err);});
   
});

app.use('/admin',adminRoutes);

app.use(shopRoutes);

app.use(errorController.getErrorPage);



// }
// http.createServer(rqListener);
//we can also use an alternative syntax for sending/receiving server requests.


/*Alternative is given below using 'app'.
 const server=http.createServer(app);
 server.listen(3001); alternative line */

mongoose.connect('mongodb+srv://uditsingh294:udit1998@cluster0-aqzf0.mongodb.net/shop?retryWrites=true&w=majority')
.then((result)=>{
    User.findOne().then(user=>{
        if(!user){
            const user=new User({
                name:'Udit',
                email:'udittest@gmail.com',
                cart:{items:[]}
            });
            user.save();
         }
    });  
    app.listen(3005);
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
