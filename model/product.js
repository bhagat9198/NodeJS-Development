const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');

const p = path.join(rootDir, 'data', 'products.json');

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if(err) {
      cb([]);  
    } else {
      cb(JSON.parse(fileContent));
    }
  });
}


module.exports = class Product {
  
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    // storing product id, which is passed to constructor
    // converting the number to string format
    // this.id = numID.toString();
  }

  save() {
    // easy way to define a id to the every new product we are stronging in an array
    this.id = Math.random().toString();
    getProductsFromFile((products) => {
      products.push(this);
  
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  };

  static fetchAll(cb) {
    getProductsFromFile(cb);
  };

  static findById(id, cb) {
    getProductsFromFile(prod => {
      // thus, we will have array of objects and each object will have an id
      // "find" method will recieve a function, which will get an product which it currently looking at and then check its id with id we passed. if id got matched, that product is retured
      const ppp = prod.find(p => p.id === id);
      console.log(ppp);
      // thus, afterwards calling a callback with that product(from above statement)
      cb(ppp);
    });
  };
};