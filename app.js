const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const rootDir = require('./util/path');
const errorController = require('./controller/error');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./model/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, 'public')));

app.use((req, res, next) => {
  User.findbyId('5e2bd8cb5df89909f06af4a4')
  .then((user) => {
    // here we are storing the user in request object
    // user we are storing it here will be just be an object with the properties. 
    // all the methods which we are defining in model/user will not be in here because the user i am getting here is the data i am getting out from the database and the methids are not stored in database. 
    // hence to have real user object with which we can interact, we should create one new user 
    req.user = new User(user.username, user.email, user.cart, user._id);
    // hece this will enable us to interact with all user model
    
    // req.user = user;
    next();
  })
  .catch(err => console.log(err));
}); 

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

mongoConnect(() => {
    app.listen(3000);
});

