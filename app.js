
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session')
const MongoDbStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');

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

const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, 'public')));
app.use(session({
  secret:'nodeApp',
  resave: false,
  saveUninitialized: false,
  store: store,
  })
);

app.use(csrfProtection);

// we have added csrf token on index page, but now we have to add it on every page we render. which means that passing agruments on every page which is quite difficult.
// same goes to "isAuthenticated"
// passing one more middleware but before our routes middleware so that every request pass through it.
app.use((req, res, next) => {
  // using special feature provided by express, we can acccess specail field on 'res' ie 'locals'. this alllows us to set local variables that are passed to views. locals simply beacuse they will only exists for the views which are rendered
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();  
  // calling next middleware
  next();
});

app.use((req, res, next) => {
  if(!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
  .then(user => {
    req.user = user;
    next();
  })
  .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);


mongoose.connect(MONGODB_URI,{ useUnifiedTopology: true ,useNewUrlParser: true })
.then(user => {
  console.log('CONNECTED');
  app.listen(3000);
})
.catch(err => console.log(err));

