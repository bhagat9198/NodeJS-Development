// we have set the connection between our app and sql database. so we can pass queries from our app and get the results from the database.

const mysql = require('mysql2');

// we have 2 ways of connecting to database
// 1. we set up connection which we can use to run queries and we should always close the connection once we are done with the query. DOWNSIDE: we need to re-execute the code to create the connection for every new query and there will be lot of queries because we will fetch data, delete data, write data. so creating a new connections all the times becomes inefficient both in our code and also regarding the connection to the database which is establish and the performance this may cost. 
    // mysql.createConnection

// 2. create a connection pool (can read in documents of mysql2) 
// creating pool of connections which will always reach out to it whenever we have query to run and then we get new connection from that pool which manage multiple connections so that we can run multiple queries simultaneously because earch query needs its own connection  and once query is done, connecttion will be handed back to the pool and its avaliable for new query. pool will be finished once our application finishes/shuts down.
// const pool = mysql.createPool()

// we need to pass JS object within it with some info about our database engine with whom we are connecting.
const pool = mysql.createPool({
  // passing server name/ip address
  host: 'localhost',
  // passing username, by default username is root while configering database
  user: 'root',
  // passing database name as database will have multiple schemas within it
  database: 'nodeapp',
  // passing password of database
  password: 'toor'
});

// after creating a pool, we can export it
// we are exporting it in different way ie with promise() method. as this will allow us to use promises when working with pool connections which handles asynchronous data. we are not using callbacks, because promises allow us to write code in bit more structured way.[ no need of nested callabcks but we can have promise chain]
module.exports = pool.promise();