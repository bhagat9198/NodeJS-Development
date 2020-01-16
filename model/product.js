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
    // first of all we need to know which product to delete and then update rest of the products so that we can write back to the file
    getProductsFromFile(products => {
      // const productIndex = products.findIndex(prod => prod.id === id);
      // now we get to know the index of product which we want to remove. and then afterwards removing, save rest of the products back to the file. 

      // but,there is another function(inbuild), which will help us much better way
      // "filter" also is anonymous function and will return all elements as part of new array that do match the condition
      // const updatedProducts = products.filter(prods => prods.id  === id);

      // but we only need elements whos id is not equal to the passed id so,
      const updatedProducts = products.filter(prods => prods.id  !== id);

      // saving to the file
      fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        if(!err) {
          // if no error occurs then we have to delete that element from that cart too, as if product doesnt exists then its no use of product to be in cart
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