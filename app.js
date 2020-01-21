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

// importing models
const Cart = require('./model/cart');
const CartItem = require('./model/cart-items');


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: true }));
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

// asscations
User.hasOne(Cart);
Cart.belongsTo(User); //optional to write, just the inverse of above
// just to make sure, we are writing the inverse
// thus, cart will get 'userId' field 

// many to many realtionship : one cart can hold multiple products and single product can be in mutliple carts. 
// Cart.belongsToMany(Product);
// Product.belongsToMany(Cart);
// this ablove realtion works with intermediate table which connects them which basically stores a combination of productIds and userIds
// thus, we have to tell where to store these connections. to tell this connection, we have to provide addational field
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});

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
  // console.log(user);
  app.listen(3000);  
})
.catch(err => {
  console.log('err', err);
});