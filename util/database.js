const mongodb = require('mongodb');
const MongodbClient = mongodb.MongoClient;
 
let _db;

const mongoConnect = callback => {
  MongodbClient.connect('mongodb+srv://nodeApp:nodeApp@nodeapp-oke9f.mongodb.net/shop?retryWrites=true&w=majority',{ useUnifiedTopology: true })
  .then((client) => {
    console.log('Connected!!'); 
    _db = client.db();
    callback();
  })
  .catch(err => {
    console.log(err);
    throw err;
  });
}

const getDb = () => {
  if(_db) {
    return _db;
  }
  throw 'No database found!!';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
