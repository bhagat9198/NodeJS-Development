const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session')
const MongoDbStore = require('connect-mongodb-session')(session);

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const rootDir = require('./util/path');
const errorController = require('./controller/error');
const User = require('./model/user');

const app = express();

const MONGODB_URI = 'mongodb+srv://nodeApp:nodeApp@nodeapp-oke9f.mongodb.net/shop?authSource=admin&replicaSet=nodeApp-shard-0&readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=true';

const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: 'sessions',
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, 'public')));
app.use(session({
  // cookie which will be created here is by session. this will be known as session cookie.
  // but the cookie which was inilized earlier is not as session, its was just a cookie.
  // hence there is diffrence between session cookie and cookie.
  secret:'nodeApp',
  resave: false,
  saveUninitialized: false,
  store: store,
  // we can define our own cookie and attributes of cookies
  // cookie: {
  //   secure: true
  // }
}));


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


mongoose.connect(MONGODB_URI,{ useUnifiedTopology: true ,useNewUrlParser: true })
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