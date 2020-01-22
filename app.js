const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const rootDir = require('./util/path');
const errorController = require('./controller/error');
const sequelize = require('./util/database');
const Product = require('./model/product');
const User = require('./model/user');
const Cart = require('./model/cart');
const CartItem = require('./model/cart-items');

// importing models
const Order = require('./model/order');
const OrderItem = require('./model/order-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, 'public')));

app.use((req, res, next) => {
  User.findByPk(1)
  .then((user) => {
    req.user = user;
    next();
  })
  .catch(err => console.log(err));
}); 

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User); 
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});

// associations
// user can do many orders
User.hasMany(Order);
// but order will belong to only one user
Order.belongsTo(User); //inverse of above
// diffrent orders can have differnt products. thus many to many
Order.belongsToMany(Product, {through: OrderItem});

// sequelize.sync()
sequelize.sync({force: true})
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
  // creating the cart for the user
  return user.createCart();
})
.then(cart => {
  app.listen(3000);  
  
})
.catch(err => {
  console.log('err', err);
});