const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session')
const MongoDbStore = require('connect-mongodb-session')(session);

// using csurf token
// first we have to require it
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

// inilising csrf: executing it like a funtion
// we can configure it, by sending object in argument
// eg: storing the secret taht is used for assigning the token, so for hashing them, but we will leave it to default. reffer to docs for more info
// const csrfProtection = csrf({key: value});

// thus, now its just another middleware
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

// using csrf middleware
// it should be used once the session has been created, as it will use that session.
app.use(csrfProtection);
// thus csrf protection is enabled but now we have to modify our views to use it

// now with every non get request, csrf tocken will be checked. if csrf token is not found, we will get an error "ForbiddenError: invalid csrf token".
// hence, it is nessary to put csrf token for every non get request.
// controller/shop

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