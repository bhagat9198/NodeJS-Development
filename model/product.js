/**************************************************************
 
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
    return db.execute('INSERT INTO products(title, imageUrl, price, description) VALUES (?,?,?,?)',
    [this.title, this.imageUrl, this.price, this.description]);
  };

  static deleteById(id) {

  };

  static fetchAll() {
    return db.execute('SELECT * FROM products');
  };

  static findById(id) {
    return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
  }
};

******************************************************************/

// we will recreate our product model from scratch

// importing sequelize class
const Sequelize = require('sequelize');

// importing sequelize object
const sequelize = require('../util/database');
// it is not only a connection pool but is fully configured sequelize environment which does have a connection pool but have other features of sequelize package .active

// defining our new model by "define()" which takes some arguments
// 1st: modelName - it is typically in lowercase
// 2nd: define the structure of our model, which will automatically create database tabel. this will be JS object and in this we define the attributes or fields our tabel should have 
const Product = sequelize.define('product', {
  // here defining the attrivutes wgich table should have
  id : {
    // defining the properties if "id" field
    type: Sequelize.INTEGER,
    allowNull : false,
    autoIncrement : true,
    primaryKey : true
  },
  // if we have to define only type of attribute it should be, we can do it in one line without creating object
  title : Sequelize.STRING,
  price : {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  imageUrl : {
    type: Sequelize.STRING,
    allowNull: false
  },
  description : {
    type : Sequelize.STRING,
    allowNull: false
  }
});

// now we have set up our model and its ready to be used
module.exports = Product;
