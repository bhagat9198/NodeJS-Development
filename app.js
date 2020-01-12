const path =  require('path');

const express = require('express');
const bodyParser = require('body-parser');

const adminData = require('./routes/admin');
const shopeRoutes = require('./routes/shope');
const rootDir = require('./util/path');

const app = express();

// using "pug" templating engine with help of express, not node as its feature of express
// app.set(key,value): helps in setting global configration value
// to define key, value : we have few predefined keys for which we can set value
// "view engine" : tells express about out templating engine
// "views" tells where to find these dynamic html content files

// we cant use any value, but we have installed pug and it auto regisred with express,
// express knows about the pug
app.set('view engine', 'pug');

// we tell where to find our html files, bydefault it will search in "./views" folder(views folder in main project directory), but we can explicitly tell the path
// first "views" is the key
// second "views" is the value, as out html pages is in views folder itself, thus same name
app.set('views', 'views');


app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(path.join(rootDir, 'public')));

app.use('/admin',adminData.routes);
app.use(shopeRoutes);

app.use((req, res, next) => {
  res.status(404);
  res.setHeader('Content-type','text/html');
  res.sendFile(path.join(rootDir, 'views', '404.html'));
});

app.listen(3000);