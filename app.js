/************************************************************************************

// no need of this as express internally creating server for us
// const http = require('http');

// importing 3rd party module
const express = require('express');

// creating the express application by exporting express as a function
const app = express();

app.use((req,res,next) => {
  console.log('middleware');
  // will call next middleware if present
  // if response is send in present middleware, then it will no go to next middleware
  next();
});


// use method will help us add middlewares
// 'next' is function, thus function is passed in function argument
app.use((req,res,next) => {
  // console.log(req);
  console.log('another middleware');

  // no need to write this as 'send' method by default will put this haeder
  // res.setHeader('context-type', 'text/html');
  // res.write('<html><head><title>App</title></head><body>hello world</body></html>');
  // res.end();

  // check on github for internal working ->lib
  res.send('<h1>Hello World</h1>');
});

// 'app' is valid request handler ie will take request and give out response
// thus no need to create seprate request handler function
// const server = http.createServer(app);


// check on github for internal working ->appliaction.js
// 'listen' fuction will create server internally, thus no need to create explictly
app.listen(3000);


********************************************************************************************/


/****************************************************************************************
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// by default it will have use method i.e, (req,res,next) => {}
//            and next() will be pass it another middleware below it
// app.use(bodyParser.urlencoded());

// we have use the config option, otherwise it will show warning
// extended: flase means that it should able to parse non-default features 
app.use(bodyParser.urlencoded({extended : true}));

// in 'use' function we can specify the path,
// express goes from top to down for middlewares
app.use('/add-products', (req, res, next) => {
  // res.send('this is product page');
  res.send('<form action="/products" method="POST"><input type="text" name="title"><button type="submit">Add</button></form>');
  // next();
});

// "next" can be omiited as it is last arugument and it will not disturb other argument arrangement
//        and if you are not planning to use next middleware
//        but its good practice to use even if you are not using

// "use" method works with get and post request
// "get" method works only with get request
// "post" method works only with post request
// there are other methods also "put","delete",etc..
// accourding to our logic we only need post request to pass through
app.post('/products', (req, res, next) => {
  console.log(req.body);
  res.redirect('/');
});

app.use('/', (req, res, next) => {
  // we have to write full html syntax
  // res.send('This is home page');
  res.send('<html><head><title>Main App</title></head><body><h1>Home Page</h1></body></html>')
});


app.listen(3000);


****************************************************************************************/

const path =  require('path');

const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopeRoutes = require('./routes/shope');
const rootDir = require('./util/path');

const app = express();

app.use(bodyParser.urlencoded({extended : true}));

// craeting the static path to "public folder"
// we can have mutiple static, then file which match first will be rendered to file which is requesting
// app.use(express.static(path.join(rootDir, 'public', 'css')));
app.use(express.static(path.join(rootDir, 'public')));
//Eg:  app.use(express.static(path.join(rootDir, 'publics')));


// we just need to pass the router variable and no need to call it
// now all the webpages starting with "/admin", will go through adminRoutes
app.use('/admin',adminRoutes);
app.use(shopeRoutes);

app.use((req, res, next) => {
  res.status(404);
  res.setHeader('Content-type','text/html');
  // res.send('<h1>Page not found</h1>');
  // res.sendFile(path.join(__dirname, 'views', '404.html'));

  // using much clearner way to specify path
  res.sendFile(path.join(rootDir, 'views', '404.html'));
});

app.listen(3000);