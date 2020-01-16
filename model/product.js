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
  
  constructor(id,title, imageUrl, description, price) {
    // it will a null value here
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile((products) => {
      // if id is defined. tis will be true only if we are editing product
      if(this.id) {
        const existingProductIndex = products.findIndex(prods => prods.id === this.id);
        const updatedProduct = [...products];
        // "this" inside of this class is an updated product because we have imagined that we have created a new product instance. and we populate exisiting product by the newly created product instance. 
        updatedProduct[existingProductIndex] = this;

        // writing it to the file
        // "updatedProduct" we have to save to the file as it contain edit product info
        fs.writeFile(p, JSON.stringify(updatedProduct), (err) => {
          // console.log(err);

        });
      } else {
        // if the productID is "null" ie, we are creating new product instance and not editing 
        this.id = Math.random().toString();

        products.push(this);
    
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err);
        });
      }
      
    });
  };

  static fetchAll(cb) {
    getProductsFromFile(cb);
  };

  static findById(id, cb) {
    getProductsFromFile(products => {
      const product = products.find(p => p.id === id);
      cb(product);
    });
  };
};