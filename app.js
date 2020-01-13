const path =  require('path');

const express = require('express');
const bodyParser = require('body-parser');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const rootDir = require('./util/path');

const app = express();

// no need to register the engin, as exoress auto register it
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(path.join(rootDir, 'public')));

app.use('/admin',adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404);
  res.setHeader('Content-type','text/html');
  // passing the argument to templating engine doesnt change, it remains the same
  // "path: 'Error'" we passed becasue ejs engin will check "path" argument in naviagation bar logic of template. if we will not provide, we will get an error
  res.render('404', {pageTitle: "404", path: 'Error'});
});

app.listen(3000);