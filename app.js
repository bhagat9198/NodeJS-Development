const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session')

// as we will use mongodb to store sessions
// it will give us the function which should execute to which we pass ou session
const MongoDbStore = require('connect-mongodb-session')(session);

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const rootDir = require('./util/path');
const errorController = require('./controller/error');
const User = require('./model/user');

const app = express();

// all uppercase, another way of telling its a constant and it value will not change
const MONGODB_URI = 'mongodb+srv://nodeApp:nodeApp@nodeapp-oke9f.mongodb.net/shop?authSource=admin&replicaSet=nodeApp-shard-0&readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=true';
// if any errors, remove the string whch is after collection name.


// executing "MongoDbStore" as a construtor, to which we pass object which will contain our agruments
const store = new MongoDbStore({
  // "uri": it will take a connection string because it needs to know in which database/ server to store the data.
  // we already have connection string while we connect to database before starting the server
  // we define separte database if we want, but we use the same, hence using same url
  uri: MONGODB_URI,
  // defining the collection.
  collection: 'sessions',
  // we can add more info like expires which delete the session automatically once the expires times comes
  // expires
});
// our store is setup, now we have to use the store to store the session info in database
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, 'public')));
app.use(session({
  secret:'nodeApp',
  resave: false,
  saveUninitialized: false,
  // using the 'store'. lhs 'store' is key and rhs 'store' is the value which we have initilzed above
  store: store
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