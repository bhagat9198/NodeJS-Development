const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');

const p = path.join(rootDir, 'data', 'cart.json');

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // fetch the previous product
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      const exisitingProductIndex = cart.products.findIndex(prod => prod.id === id);
      const exisitingProduct = cart.products[exisitingProductIndex];
      let updatedProduct;

      // add new product / incraese the quantity
      if (exisitingProduct) {
        updatedProduct = { ...exisitingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[exisitingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        // updating the cart after adding new product to the cart
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice;
      fs.writeFile(p, JSON.stringify(cart), err => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }
      const updatedProduct = { ...JSON.parse(fileContent) };
      const product = updatedProduct.products.find(prods => prods.id === id);
      const productQty = product.qty;
      updatedProduct.products = updatedProduct.products.filter(prods => prods.id !== id);
      updatedProduct.totalPrice = updatedProduct - (productPrice * productQty);

      fs.writeFile(p, JSON.stringify(updatedProduct), (err) => {
        console.log(err);
      });
    });
  }

  // we will return the entire cart in the callback
  // we add a callback so that we can call it once we get all the id's which are present in cart
  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      // converting JSON to JS data
      const cart = JSON.parse(fileContent);
      // this will fail, if we got an error, thus checking for error
      // cb(cart);

      if(err) {
        // if no items are present in the cart
        cb(null);
      } else {
        cb(cart);
      }
    });
  }

}

