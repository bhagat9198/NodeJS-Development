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

// EG: using the connection pool, 
// both commands will execute query but execute is bit safer
// db.execute() db.query()
// we have to end our connection also when our appliaction shuts down
// db.end(); 
// but we will not shut our appliaction down. 

// within execute('') we can write down our sql command
// creating the table 'products' tabel in our database and writing down entries
db.execute('SELECT * FROM products');

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

app.listen(3000);