const mongodb = require('mongodb');
// extracting mongodb cliet constructor
const MongodbClient = mongodb.MongoClient;

// // now we can make use of client to connect with our database(db)
// // connection is done by:
// // "connect()" method accepts the url where we want to want to connect. it will will be the string provided in mongodb
// MongodbClient.connect('mongodb+srv://nodeApp:nodeApp@nodeapp-oke9f.mongodb.net/test?retryWrites=true&w=majority')
// // it will give our promise
// .then(result => console.log('Connected!!!'))
// .catch(err => console.log(err));
// // thus now we have a file which when is executed will connect to our db. and we have to execute with our app.js file


// we are creating a function expresstion so that we can call this function from app.js to execute it.
// it will take a callback function as an argument
const mongoConnect = callback => {
  MongodbClient.connect('mongodb+srv://nodeApp:nodeApp@nodeapp-oke9f.mongodb.net/test?retryWrites=true&w=majority',{ useUnifiedTopology: true })
  .then((client) => {
    console.log('Connected!!');
    callback(client);
  })
  .catch(err => console.log(err));
}

module.exports = mongoConnect;







// const Sequelize = require('sequelize').Sequelize;

// const sequelize = new Sequelize('nodeapp', 'root', 'root', {
//   dialect: 'mysql',
//   host: 'localhost' 
// });

// module.exports = sequelize;



