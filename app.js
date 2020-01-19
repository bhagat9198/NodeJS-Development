const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const rootDir = require('./util/path');
const errorController = require('./controller/error');
const sequelize = require('./util/database');

// requrering both the models
const Product = require('./model/product');
const User = require('./model/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDir, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// assocaiation between tables
// "belongsTo" tells that user can have many products
// "{constraints: true, onDelete: 'CASCADE'}" these are optioanl to write, not nessary. 
// "CASCADE" if user is deleted, product associating will also get deleted
Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
// "hasMany" also means the same, thus optinal to write.
User.hasMany(Product);

// we alraedy created our tables in db, earlier. so these new assoications cant be assigned.
// to make changes to existing tables, we will pass an arguments to sync() method. ie "{force: true}"
// this should be used only at development tym, as we dont want to write our new table over existing table.
 
sequelize.sync({force: true})
.then(result => {
  // console.log('result' ,result);
  app.listen(3000);
})
.catch(err => {
  console.log('err', err);
});