
// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const User = sequelize.define('user', {
//   id : {
//     primaryKey: true,
//     allowNull: false,
//     autoIncrement: true,
//     type: Sequelize.INTEGER
//   },
//   name : {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   email : {
//     type: Sequelize.STRING,
//     allowNull: false
//   }
// });

const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;
class Users {
  constructor(username, email) {
    this.username = username;
    this.email = email
  }

  save() {
    const db = getDb();
    return db.collection('users').insertOne(this)
    .then(user => {
      // console.log(user);
      // return user
    })
    .catch(err => console.log(err));
  }

  static findbyId(userId) {
    const db = getDb();

    // find() will give the cursor and so we are putting next() which will give out very first element
    // return db.collection('users').find({_id: mongodb.ObjectId(userId)}).next();

    // findOne() will eaxctly gives us one document with matching condition, thus need of putting next()
    // we can pust .then() and catch() block if we wish but as we are not doing in these blocks. hence ommited out.
    return db.collection('users').findOne({_id: mongodb.ObjectId(userId)});
  }
}

module.exports = Users;