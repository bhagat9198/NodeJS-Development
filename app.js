const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session')
const MongoDbStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

// requering multer which will act on form whch has "enctype="multipart/form-data"
const multer = require('multer');
// requring 3 party manager
const uniqid = require('uniqid');

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


// const fileStorage = multer.diskStorage({
//   // inbuild key arrribute
//   destination: (req, file, cb) => {
//     // configuringing as the function.
    
//     // calling the callback, so that it can be executed. 
//     // 1st arg: returing null if get an error while storing a file. thus returing 'null'
//     // 2nd arg: if we dont get any error, storing the file in "images" folder
//     cb(null, 'images');
//   },
//   filename: (req, file, cb) => {
//     // null: returning if we get an error
//     // else saving the file
//     // we will not able to use "file.filename" because we are seeting up filename manually. so multer will not set 'filename' automatically.
//     // as we are using "file.originalname", extension of the file will be set automtically. 
//     // cb(null, `${file.filename} ${file.originalname}`); //undefined filehash
//     // cb(null, Date().toString() + '-' + file.originalname); //error
//     // cb(null, file.fieldname + '-' + file.originalname); //undefined-filehash   
//   }
// });


fileStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'images');
  },
  filename: function(req, file, cb) {
    // creating the unique id by using current date
    // cb(null, Date.now()+'-'+file.originalname);

    // using 3party package to create unique id
    cb(null, uniqid()+'-'+file.originalname);
  }
});


// app.use(multer({dest: 'images'}).single('image'));
// "storage" key has many attributes then "dest". thus passing it as argument and calling the function
app.use(multer({storage: fileStorage}).single('image'));

app.use(bodyParser.urlencoded({ extended: true }));
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
  .then(user => {
    if(!user) {
      return next();
    }
    req.user = user;
    next();
  })
  .catch(err => {
    next(new Error(err))
  }); 
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use('/500', errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
  res.status(500).render('500', 
  { pageTitle: "500",
    path: 'Server Error'
 });
});

mongoose.connect(MONGODB_URI,{ useUnifiedTopology: true ,useNewUrlParser: true })
.then(user => {
  console.log('CONNECTED');
  app.listen(3000);
})
.catch(err => console.log(err));

