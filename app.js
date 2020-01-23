const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

// seting up admin routes
const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');
const rootDir = require('./util/path');
const errorController = require('./controller/error');
const mongoConnect = require('./util/database');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, 'public')));

// app.use((req, res, next) => {
//   User.findByPk(1)
//   .then((user) => {
//     req.user = user;
//     next();
//   })
//   .catch(err => console.log(err));
// }); 

app.use('/admin', adminRoutes);
// app.use(shopRoutes);
app.use(errorController.get404);

// mongoConnect(client => {
//   console.log(client);
//   app.listen(3000);
// })

// thus, now we will not get any callback arugumet result as we are not returning any more in 'util.database'
mongoConnect(() => {
  console.log(client);
  app.listen(3000);
})

