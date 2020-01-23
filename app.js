const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

// const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');
const rootDir = require('./util/path');
const errorController = require('./controller/error');

// requring
const mongoConnect = require('./util/database');

/****************************************************
REMOVE

const Product = require('./model/product');
const User = require('./model/user');
const Cart = require('./model/cart');
const CartItem = require('./model/cart-items');
const Order = require('./model/order');
const OrderItem = require('./model/order-item');

*********************************************************/
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, 'public')));

// app.use((req, res, next) => {
//   User.findByPk(1)
//   .then((user) => {
//     req.user = user;
//     next();
//   })
//   .catch(err => console.log(err));
// }); 

// as our routes have functions which are using sequelize and we are not using now. so it will pop out erros
// to check if mongodb is connected, we will comment it out

// app.use('/admin', adminRoutes);
// app.use(shopRoutes);
// app.use(errorController.get404);


/*********************************************************
DELETE
Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User); 
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});
User.hasMany(Order);
Order.belongsTo(User);
Order.belongsToMany(Product, {through: OrderItem});

sequelize.sync()
// sequelize.sync({force: true})
.then(result => {
  return User.findByPk(1)
})
.then( user => {
  if(!user) {
    return User.create({name: 'max', email: 'test@t.com'});
  }
  return user;
})
.then(user => {
  return user.createCart();
})
.then(() => {
  app.listen(3000);   
})
.catch(err => {
  console.log('err', err);
});
**************************************************************/

// mongoConnect is the function which we have imported, and it accepts a callback function result, this function will get executed when we are connected (callback gives successful result)
mongoConnect(client => {
  console.log(client);
  app.listen(3000);
})

