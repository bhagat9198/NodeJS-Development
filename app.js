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

mongoose.connect('mongodb+srv://nodeApp:nodeApp@nodeapp-oke9f.mongodb.net/test?authSource=admin&replicaSet=nodeApp-shard-0&readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=true',{ useUnifiedTopology: true, useNewUrlParser: true })
.then(result => {
  console.log('CONNECTED');
  app.listen(3000);
})
.catch(err => console.log(err));
