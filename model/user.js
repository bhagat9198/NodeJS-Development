
const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class User {
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
    return db.collection('users').findOne({_id: mongodb.ObjectId(userId)});
  }
}

module.exports = User;


