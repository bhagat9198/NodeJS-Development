const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session')
const MongoDbStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

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

app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();  
  next();
});

app.use((req, res, next) => {
  if(!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)

  // but if throw error outside of async code, we will reach the error handling middleware
  throw new Error('Dummy Error outside of async code!!!!')
  // the reason for that in sync code (outside of callbacks and promises) when we throw error, express will get to know and execute error handling middleware
  .then(user => {
    // throwing the error so that it reaches the catch block
    throw new Error('Dummy Error!!!!!')

    if(!user) {
      return next();
    }
    req.user = user;
    next();
  })
  .catch(err => {
    // we though we have error handling middleware, instaed of going to error handling middleware, our code is crashing.
    // throw new Error(err);

    // this is because we are inside async code ie inside a promise(then or catch block). so we throw errors in async code, we will not reach the error handling middleware

    // but inside of promises and callbacks, it will not work 
    // so,
    next(new Error(err))
    // thus, we have wrap our error with next()
  }); 
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use('/500', errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
  // res.redirect('/500');
  // as we have put an error in attaching user in request. it will be in infinite loop(redirect and new request(and this will agin cause error and then redirect)). 

  res.status(500).render('500', 
  { pageTitle: "500",
    path: 'Server Error',
 });
});

mongoose.connect(MONGODB_URI,{ useUnifiedTopology: true ,useNewUrlParser: true })
.then(user => {
  console.log('CONNECTED');
  app.listen(3000);
})
.catch(err => console.log(err));

