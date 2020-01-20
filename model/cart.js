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
      // if we delete a product from admin page and that product is not inn the cart, then it will give us error.
      // SOLUTION:- to delete, we first need to check if the given product is in cart, if it is not there then we simply need to return . we dont want to try to edit it as it is not there.
      if(!product) {
        return;
      }
      const productQty = product.qty;
      updatedProduct.products = updatedProduct.products.filter(prods => prods.id !== id);
      updatedProduct.totalPrice = updatedProduct - (productPrice * productQty);

      fs.writeFile(p, JSON.stringify(updatedProduct), (err) => {
        console.log(err);
      });
    });
  }

  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      if(err) {
        cb(null);
      } else {
        cb(cart);
      }
    });
  }

}

