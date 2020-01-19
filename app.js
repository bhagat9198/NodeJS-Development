const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const rootDir = require('./util/path');
const errorController = require('./controller/error');
const db = require('./util/database');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDir, 'public')));

// if we will not use promise, then we have to use callback
// EG: db.execute('SELECT * FROM products', cb => {})

// promises helps us to write cleaner code and gives us then() nad catch() block. both the blocks will take anomous function and will execute one of them according to the condition
// .then() when request is successful
// .cath() in case of error
// db.execute('SELECT * FROM products')
//   .then((result) => {
//     console.log(result);
//   })
//   .catch(err => console.log(err));

  // .then will be executes and gives us an array which has 2 sub arrays
  // first array is the result from database and second array hold the metadata 

// thus extrating seprately
// db.execute('SELECT * FROM products')
//   .then((result) => {
//     console.log(result[0]);
//     console.log(result[1]);
//   })
//   .catch(err => console.log(err));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

app.listen(3000);