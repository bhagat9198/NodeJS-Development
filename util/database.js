// const mysql = require('mysql2');

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   database: 'nodeapp',
//   password: 'root'
// });

// module.exports = pool.promise();




// first step is to craete a model with sequlize and connect with database
// deleting other tables in database if there (because we want sequlize to manage our tables) 
// connecting to database 
// even though we are not importing mysql but it uses mysql behind the sceans

const Sequelize = require('sequelize');
// "Sequelize" is constructor function... its a class

// creating the new instance of Sequelize
// Sequelize() accepts numbers of paramerters username, password,database, password
// 1: database name
// 2: username
// 3. password
// 4: option objects {}
// dialect: tells which database we are using . this is nessary as different sql databases have littel different sql syntax
// host: by default it will use localhost, but we set explicitly
const sequelize = new Sequelize('nodeapp', 'root', 'root', {
  dialect: 'mysql',
  host: 'localhost' 
});

// thus, this will create connection pool with sequelize object
module.exports = sequelize;



