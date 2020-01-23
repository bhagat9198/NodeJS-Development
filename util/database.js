const mongodb = require('mongodb');
const MongodbClient = mongodb.MongoClient;
 
// "_" before the variable means that this variable will be used internally ie within thi file
let _db;

const mongoConnect = callback => {
  // mongodb+srv://nodeApp:nodeApp@nodeapp-oke9f.mongodb.net/test?retryWrites=true&w=majority: in this "test" means that we are connecting to test database by default. 
  // MongodbClient.connect('mongodb+srv://nodeApp:nodeApp@nodeapp-oke9f.mongodb.net/test?retryWrites=true&w=majority',{ useUnifiedTopology: true })

  // but we have to connect it to 'shop', so our connection string will be modified to this:-
  MongodbClient.connect('mongodb+srv://nodeApp:nodeApp@nodeapp-oke9f.mongodb.net/shop?retryWrites=true&w=majority',{ useUnifiedTopology: true })

  .then((client) => {
    console.log('Connected!!'); 
    // storing the access to the database
    //  _db = client.db('test) : we can do like this also to override the existing database which is given in connection string

    // sidenote:
    // unlike in sequel, in mongo we never need to create the database or add the tabels to the collection ahead of time, as these will br create on the fly when we first access it
    // thus, this again fitting that flexibilty feature which mongo gives us.

    // thus, above we are telling mongo to connect to shop databse and if that database is not present then it will create it as soon as we start writing data to it.



    // thus, here we are storing the connection to database in _db variable  
    _db = client.db();

    // callback(client);
    // we will not retuen the client inthe callback
    callback();
  })
  .catch(err => {
    console.log(err);
    // throwing the error
    throw err;
  });
}

const getDb = () => {
  // if database is set
  if(_db) {
    // rerturing the access to the database
    return _db;
  }
  // else nothing will happen
  // throwing the error
  throw 'No database found!!';
}

// module.exports = mongoConnect;

exports.mongoConnect = mongoConnect;
// connecting and storing the connection to the database, thus it will keep on running: "_db = client.db();"
// "const getDb = () => {" wil return access to that connection, if it exists
  // it method, will act as connection pooling and gives us sufficent connections for multiple interactions with database
exports.getDb = getDb;

