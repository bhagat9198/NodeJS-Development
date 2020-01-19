const db = require('../util/database');

const Cart = require('./cart');

module.exports = class Product {

  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    // to prevent sql injection (attack in which user enter code instaed of data which can be used to hack the database), we will put "?" instaed of directly putting values.
    // thus, second argument will take the values and put them as data inplace of "?".
    // this is extra security feature
    // "title, imageUrl, price, description" should have the same names of the fields in table 'products'
    // db.execute() is a method which will give out promise. so we will return it to the fuction which is calling this function. hence using "return"
    return db.execute('INSERT INTO products(title, imageUrl, price, description) VALUES (?,?,?,?)',
    [this.title, this.imageUrl, this.price, this.description]);
  };

  static deleteById(id) {

  };

  static fetchAll() {
    return db.execute('SELECT * FROM products');
  };

  static findById(id) {
  }
};


