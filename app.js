const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const rootDir = require('./util/path');
const errorController = require('./controller/error');
// const db = require('./util/database');
const sequelize = require('./util/database');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDir, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);


// now our models are created, we have to tell sequelize to create table in database as specified. 
// if tables are already present, it should not override it. but if we want, we can tell dequelize to do so

// there is a special method, sync method
// sync method have to look all the methdos, we define (products model in products.js). so its aware of all the models and then create tables for them 
// sequelize.sync();
// thus, it syncs all the models to the db(database) by creating appropiate tables and relations, if we have defined
// sequelize will give promise

sequelize.sync()
.then(result => {
  console.log('result' ,result);
  // if sync is successfull, then server should start
  app.listen(3000);
})
.catch(err => {
  console.log('err', err);
})

// thus, if promise is successful, it will create a tabel 'products' eventhough we specified 'product' in our model.
// along with those fields it will also create 2 from fields by default ie, createdAt and updatedAt. if we dont want, we can tell sequelized not to make.