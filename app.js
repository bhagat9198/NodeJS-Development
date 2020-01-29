const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// requring express-session
const session = require('express-session')

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const rootDir = require('./util/path');
const errorController = require('./controller/error');
const User = require('./model/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, 'public')));
// initlising session middle here so it will be used in every incoming request
// executing as a function and within it passing JS object which will hold our arguments
app.use(session({
  // secret: used in signing the hash which stores our id in the cookie. value to secret is a string which should be long
  secret:'nodeApp',
  // "resave: false" this means that session will not be saved on every request which is done. thus, it should change only when something is changed, hence increasing performance  
  resave: false,
  // "saveUninitialized: false" because this will also ensures that no session gets saved for the request where it doesnt need to get saved as nothing was changed
  saveUninitialized: false
  // we can set up cookies, but if it is not given default values will be taken
  // cookie: {
  //   maxAge: 10,
  //   expires: httpDateFormate
  // }
}));
// thus, our session is configured and raedy to use

app.use((req, res, next) => {
  User.findById('5e2f196a2822d66dbc7f072d')
  .then(wholeUser => {
    req.user = wholeUser;
    next();
  })
  .catch(err => console.log(err));
}); 

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);


mongoose.connect('mongodb+srv://nodeApp:nodeApp@nodeapp-oke9f.mongodb.net/shop?authSource=admin&replicaSet=nodeApp-shard-0&readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=true',{ useUnifiedTopology: true, useNewUrlParser: true })
.then(result => {
  console.log('CONNECTED');
  return User.findOne()
})
.then(user => {
  if(!user) {
    const username = 'test';
    const email = 'test@test.com';
    const user = new User({
      username: username,
      email: email,
      cart: {
        items: []
      }
    });
    return user.save()
  }
})
.then(user => {
  app.listen(3000);
})
.catch(err => console.log(err));