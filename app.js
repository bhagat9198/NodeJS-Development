const path =  require('path');

const express = require('express');
const bodyParser = require('body-parser');
// handlesbars are not like 'pug', so we have to explicity tell express about "handlebars"
// to check if your teamplating engin is auto supported by express, just check the docs regarding that
const expressHbs = require('express-handlebars');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const rootDir = require('./util/path');

const app = express();

// after registering, we have to tell, express "handlebars" is templet engin and it exits, we do
// "engin()" is method which helps in registering templating engin which is not buit--in like pug
// "handlebars" is the engine name, which we wish to call(we can give any name)
// "expressHbs" is templating engine, which we have registered above, and we have to call it
// app.engine('handlebars', expressHbs());

// "extname: 'hbs'" : to tell main layout file has .hbs extenstion, this argument only to specify about layout file.active
//  "layoutsDir: 'views/layouts/'" : to tell the path of layout folder, by default it uses "views/layouts/" path
// "defaultLayout: 'mainContent'" : to tell the name of layiut file, bydefault it will use "main.handlebars" file name.
app.engine('hbs', expressHbs({extname: 'hbs', layoutsDir: 'views/layouts/', defaultLayout: 'mainContent'}));
app.set('view engine', 'hbs');
app.set('views', 'views');


app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(path.join(rootDir, 'public')));

app.use('/admin',adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404);
  res.setHeader('Content-type','text/html');
  // passing the argument to templating engine doesnt change, it remains the same
  res.render('404', {pageTitle: "404"});
});

app.listen(3000);