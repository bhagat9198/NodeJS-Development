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
 
sequelize.sync()
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
  console.log(user);
  app.listen(3000);  
})
.catch(err => {
  console.log('err', err);
});