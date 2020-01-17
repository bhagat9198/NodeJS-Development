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
        // if there is nothing in cart, we can get a error as there is nothing to delete.
        // so we will return the cart as it is
        return;
      }
      // if no error occurs, then we will delete the product from the cart and reduce the total price
      // we are in readFile(), so instead of accessing "cart", we have to access "fileContent" which contain all cart products
      // fileContent is in JSON formate, so we have convert it back to the JS formate
      const updatedProduct = { ...JSON.parse(fileContent) };
      const product = updatedProduct.products.find(prods => prods.id === id);
      const productQty = product.qty;
      updatedProduct.products = updatedProduct.products.filter(prods => prods.id !== id);
      // const updatedTotalPrice = product.totalPrice - (productPrice * productQty);
      updatedProduct.totalPrice = updatedProduct - (productPrice * productQty);

      // once everything is updated after deleting, storing it back to the file
      fs.writeFile(p, JSON.stringify(updatedProduct), (err) => {
        console.log(err);
      });
    });
  }

}

