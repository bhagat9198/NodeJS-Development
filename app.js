const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const rootDir = require('./util/path');
const errorController = require('./controller/error');
const User = require('./model/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, 'public')));

app.use((req, res, next) => {
  // once the user is created and registered in databse successfully, storing the user in request object. so that we can implement other functionalities related to user like adding products to cart for particular user

  User.findById('5e2ef0bad16e4775146f745c')
  .then(wholeUser => {
    // here 'wholeUser' is user model object and can use all the functionalites of user model. thus, we dont have craete another object in user model to use other funtionlities of user model.
    req.user = wholeUser;
    next();
  })
  .catch(err => console.log(err));

  // User.findbyId('5e2ef63cea0a3b388c340753')
  // .then((user) => {
  //   req.user = new User(user.username, user.email, user.cart, user._id);
  //   next();
  // })
  // .catch(err => console.log(err));
}); 

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

// changing the database name from 'test' to 'shop'
mongoose.connect('mongodb+srv://nodeApp:nodeApp@nodeapp-oke9f.mongodb.net/shop?authSource=admin&replicaSet=nodeApp-shard-0&readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=true',{ useUnifiedTopology: true, useNewUrlParser: true })
.then(result => {
  console.log('CONNECTED');
  // inititally we will create dummy user manualy
  // const username = 'test';
  // const email = 'test@test.com';
  // creating user object on user model
  // const user = new User({
  //   username: username,
  //   email: email,
  //   items: []
  // });
  // saving the user in the database, once user object recives all the values

  // as we are returning the user, it will out promise. if promise is successful, running the server.
  // return user.save()
  // .then(user => {
  //   app.listen(3000);
  // })


  // once dummy user is created, we should check, if user is alraedy there or not. elese every time, server runs, it will craete one user on the fly and because of save() method, user will get registered in database.

  // checking if user is alraedy present or not
  User.findOne()
  // findOne(): if we dont give argument, will always give us first user if it finds in the database
  // if it didnt find any user object within user database, it will give undefinied
  .then(user => {
    // thus, it will have user objects, which it find from User model
    // if user object is undefined ie no user is registered
    if(!user) {
      const username = 'test';
      const email = 'test@test.com';
      const user = new User({
        username: username,
        email: email,
        items: []
      });
      return user.save()
    }
  })
})
.then(user => {
  app.listen(3000);
})
.catch(err => console.log(err));
