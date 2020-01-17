const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');
const Cart = require('./cart');

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
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile((products) => {
      if(this.id) {
        const existingProductIndex = products.findIndex(prods => prods.id === this.id);
        const updatedProduct = [...products];
        updatedProduct[existingProductIndex] = this;

        fs.writeFile(p, JSON.stringify(updatedProduct), (err) => {
        });
      } else {
        this.id = Math.random().toString();
        products.push(this);
    
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err);
        });
      }
      
    });
  };

  static deleteById(id) {
    getProductsFromFile(products => {
    
      const updatedProducts = products.filter(prods => prods.id  !== id);
      const productPrice = (products.find(prods => prods.id === id)).price;

      fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        if(!err) {
          Cart.deleteProduct(id, productPrice);
        }
      });
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