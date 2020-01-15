const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');

// now we will refactore the code, ie reuse the code(or improve the exisiting code)
const p = path.join(rootDir, 'data', 'products.json');

// craerting common function to extrat data from file
const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    // as we want only one command to exetue based on condition, not both
    // if(err) {
    //   cb([]);  
    // } else {
    //   cb(JSON.parse(fileContent));
    // }
    // OR
    if(err) {
      return cb([]);  
    } 
      return cb(JSON.parse(fileContent));

  });
}


module.exports = class Product {
  
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
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