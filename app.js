const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session')
const MongoDbStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
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


const fileStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'images');
  },
  filename: function(req, file, cb) {
    cb(null, uniqid()+'-'+file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/jpg' ||
     file.mimetype === 'image/jpeg' ||
     file.mimetype === 'image/png') 
  {
    cb(null, true);
  } else {
    cb(null, false)
  }
}

app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));
app.use(bodyParser.urlencoded({ extended: true }));

// statically servering the folder simply means that request to that file in that folder will be handled automtically and files will be returned. so all the heavy lifting is done behind the sceans by express.
app.use(express.static(path.join(rootDir, 'public')));

// there are number of ways through which we can serve the images to the pages of our application.
// one way is to statically server the images so that anyone any page which make request to image can get the image automatically. 
// app.use(express.static(path.join(rootDir, 'images')));

// thus, images are still not shown. the reason is that image path get appeneded to current path. fo eg: if we are on admin/product then image path becaome: admin/products/images/image.png.
// as we know, images folder is in root folder. so we have to make the path of the image absoultue ie images path should be: images/image.png. 
// this can be done by putting '/' infront of imagepath in enj files. so that path becomes absolute.
// <img src="<%= product.imageUrl %>" alt="<%= product.title %>"> => <img src="/<%= product.imageUrl %>" alt="<%= product.title %>">


// as we know, static folder servers files as if files are in root folder. but as we know files are in images folder. thus adding the path to middleware. saying that if path is "images"then give out file name.
app.use('/images',express.static(path.join(rootDir, 'images')));

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

