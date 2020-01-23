const mongodb = require('mongodb');
const MongodbClient = mongodb.MongoClient;

// to connect with the mongoConnect, we need to pass a callback and once that call get executes, it will return the result.
// however, if we do this we would have to connect to mongodb for every operation we do without terminating earlier connection. so this is not a good way of connecting with mongodb, since we want to connect and interact with it from diffeerent places in our app.
// so it would be better if we could manage one connection on our db, and then simply return access to the client which is set up once and from there to different places in our app that nees access. to that, we have we set up our connection again. 
const mongoConnect = callback => {
  MongodbClient.connect('mongodb+srv://nodeApp:nodeApp@nodeapp-oke9f.mongodb.net/test?retryWrites=true&w=majority',{ useUnifiedTopology: true })
  .then((client) => {
    console.log('Connected!!'); 
    callback(client);
  })
  .catch(err => console.log(err));
}

module.exports = mongoConnect;

