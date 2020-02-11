const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const rootDir = require('./util/path');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
// craeting the static path to "public folder"
// we can have mutiple static, then file which match first will be rendered to file which is requesting
// app.use(express.static(path.join(rootDir, 'public', 'css')));
app.use(express.static(path.join(rootDir, 'public')));
// app.use(express.static(path.join(__dirname, 'public')));

// we can add more then one static file if we have
// app.use(express.static(path.join(rootDir, 'publics')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.sendFile(path.join(rootDir, 'views', '404.html'));
})

app.listen(3000);


