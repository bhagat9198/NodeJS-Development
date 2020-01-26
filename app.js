const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
// first thing is do that let mongoose connect to database, although 'util/database' file is doing that. but with mongoose, it very easy to connect, as mongoose does all work for us behind the sceans and we dont need 'util/databse' anymore
// importing mongoose
const mongoose = require('mongoose');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const rootDir = require('./util/path');
const errorController = require('./controller/error');
// const mongoConnect = require('./util/database').mongoConnect;
const User = require('./model/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, 'public')));

app.use((req, res, next) => {
  User.findbyId('5e2d6d49c6a2166930f9858e')
  .then((user) => {
    req.user = new User(user.username, user.email, user.cart, user._id);
    next();
  })
  .catch(err => console.log(err));
}); 

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

// mongoConnect(() => {
//     app.listen(3000);
// });

// connecting with database with mongoose
// "{ useUnifiedTopology: true, useNewUrlParser: true }" :because of warrings
mongoose.connect('mongodb+srv://nodeApp:nodeApp@nodeapp-oke9f.mongodb.net/test?authSource=admin&replicaSet=nodeApp-shard-0&readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=true',{ useUnifiedTopology: true, useNewUrlParser: true })
.then(result => {
  app.listen(3000);
})
.catch(err => console.log(err));

// thus, with this we are connected to our database with mongoose . thus mongoose will manage one connection behind the scean for us, so that when we start mongoose in other places in our app from mongoose app, we can use the same connection we set up here in main server file

// now, moving our code to mongoose (all models)