const mongoConnect = require('../util/database');

// creating a class Product which will contain our model data and can exported
class Product {
  constructor(title, imageUrl, price, description) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description= description;
  }
  // now we can create a new product in JS and new object will be created according to constructor

  // now to save it in the database, creating a method 
  save() {
    // connect to mongodb and save the product object. for that we will require mongodb connection
  }
} 

/**************************************************
const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Product = sequelize.define('product', {
  id : {
    type: Sequelize.INTEGER,
    allowNull : false,
    autoIncrement : true,
    primaryKey : true
  },
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

module.exports = Product;
*******************************************/