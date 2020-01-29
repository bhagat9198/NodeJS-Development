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
  secret:'nodeApp',
  resave: false,
  saveUninitialized: false,
  store: store,
  })
);

// what can be done?
// we will re-add that middleware 
app.use((req, res, next) => {
  // finding the user, who is currently in session
  // User.findById(req.session.user._id)
  // .then(user => {
  //   // here we will not store anything in session because is alraedy something which will be managed for us automatically. and for incoming request, we register the middleware, which will lokk for session cookie. if it finds one, it will look for a fitting session in the database and load the data from there. 

  //   // thus, till the time, we come here, our session data will be loaded. now this means that now we just want to usr that session to load our real user, to create our mongoose user model.
  //   // HOW?
  //   // here we will craete a user, based on user stored in session.
  //   req.user = user;
  //   // thus, now our 'req.user' will have user model. hence in 'shop' and 'admin' file changing 'req/session.user' to 'req.user' as revious.  
  //   // our model will start working again.

  //   next();
  // })



  // once the user looged out, it will give out error, as it will serach for id of user which does not exists.
  if(!req.session.user) {
    // thus, if no user logged in, go to next middleware
    return next();
  }
  // else, find the user id
  User.findById(req.session.user._id)
  .then(user => {
    req.user = user;
    next();
  })
  .catch(err => console.log(err));
});

// app.use((req, res, next) => {
//   User.findById('5e2f196a2822d66dbc7f072d')
//   .then(wholeUser => {
//     req.user = wholeUser;
//     next();
//   })
//   .catch(err => console.log(err));
// }); 

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