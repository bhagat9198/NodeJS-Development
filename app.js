const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use('/admin',adminRoutes);
app.use(shopRoutes);

// adding response for invalid URL
app.use((req, res, next) => {
  res.send('<h1>Page Not Found</h1>');
})

app.listen(3000);


