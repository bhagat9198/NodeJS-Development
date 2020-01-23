// now we dont need connection
// const mongoConnect = require('../util/database');

// but we need access to the database
const getDb = require('../util/database').getDb;
// now we can execute 'getDb' function to get access to database and thus, can interact with databse now.

class Product {
  constructor(title, imageUrl, price, description) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description= description;
  }

  save() {
    // connect to mongodb and save the product object. for that we will require mongodb connection
  }
} 


