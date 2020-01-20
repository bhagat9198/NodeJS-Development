const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const rootDir = require('./util/path');
const errorController = require('./controller/error');
const sequelize = require('./util/database');

// requiring both the models
const Product = require('./model/product');
const User = require('./model/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDir, 'public')));

// registering the new middleware, because we want to store that user in our request so that we can use it from anywhere in our app 
app.use((req, res, next) => {
  // now we want to reachout to our database and retrive the user 
  // with the help of
  // User.findByPk(1);

  // IMPORTANT:
  // you might think that will this ever return a user if are craeting down in sync() method
  // app only registered the middleware function. so for incoming request, it will then execute this middleware function
  // npm start will first run sequelize.sync() and then user ill get registed if it not there, then server runs
  // once the server start running, request will be made and this function will get executed 

  User.findByPk(1)
  .then((user) => {
    // we want to storethe user in request
    req.user = user;
    // we can do that, we are just adding the user field to "req" object
    // we just have to amke sure, we dont overwrite the exisiting user  
    // "req.user = user;" here user is undefined by default, so now we are storing user which we retrived from the database
    // user which are reterving is not just a JS object with values stored in db and .Its a sequelize object with values stored in the database and with all the utility methods sequelize added like destroy. 
    // thus, we are storing sequelize object in request object, not just JS object
    // hence whenver we user now, we can operate sequelize methods on it.

    // we need to call "next()" so taht we can continue with the next step if we get our user and store it.
    next();
  })
  .catch(err => console.log(err));
}); 

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);
 
// sequelize.sync({force: true})
sequelize.sync()
.then(result => {
  // craeting a dummy user, which is logged in as sooon as server starts.
  return User.findByPk(1)
})
.then( user => {
  if(!user) {
    // here are passing promise
    return User.create({name: 'max', email: 'test@t.com'});
  }
  // but here only object will be returned.
  // return user;
  // we should always return the same so that next "then()" can be executed
  // so, returning user promise
  // return Promise.resolve(user);
  // but no need of that as whatever is returned from "then()" is wrapped inside promise itself. hence
  return user;
})
.then(user => {
  console.log(user);
  // hence, user is registered successfully. and we can start the server
  app.listen(3000);  
})
.catch(err => {
  console.log('err', err);
});