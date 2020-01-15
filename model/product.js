const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');

const p = path.join(rootDir, 'data', 'products.json');

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if(err) {
      return cb([]);  
    } 
      return cb(JSON.parse(fileContent));

  });
}


module.exports = class Product {
  
  constructor(title, imageUrl, description, price,numID) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    // storing product id, whichis passed to constructor
    this.id = numID;
  }

  save() {
    
    getProductsFromFile((products) => {
      products.push(this);
  
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err);
      });
    })
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }
}