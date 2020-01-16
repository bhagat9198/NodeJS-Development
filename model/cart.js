// our basic idea is to cart to hold all the objects we add and we want to group products by id and increade there quantity  in case when we add producy more than once.

// module.exports = class Cart{
//   constructor() {
//     this.product = [],
//     this.totalPrice = 0;
//   }

//   // we to cart to add or remove products. but the problem we have is that cart itself is not a object, we will constently recreate. not for every new product that we add, we dont want to have a new cart, instaed there will be.
//   // there will be always a cart in our app, we need to manage it  
// }
const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');

const p = path.join(rootDir, 'data', 'cart.json'); 

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // fetch the previous product
    fs.readFile(p, (err, fileContent) => {
      let cart = {products: [], totalPrice: 0};
      if(!err) {
        cart = JSON.parse(fileContent);
      }
      // we will get all the products which are in cart
      // console.log('cart : ' ,cart);
      
      // // analysing the cart => finding existing product
      // const exisitingProduct = cart.products.find(prod => prod.id === id);
      // let updatedProduct;

      // // add new product / incraese the quantity
      // if(exisitingProduct) {
      //   updatedProduct = {...exisitingProduct};
      //   updatedProduct.qty = updatedProduct.qty + 1;
      //   // here also, we have to update the product in the cart. as product is already present here, we need to find the index where it is located
      // } else {
      //   updatedProduct = {id: id, qty: 1};
      //   // updating the cart after adding new product to the cart
      //   cart.products = [...cart.products, updatedProduct]; 
      // }

      // cart.totalPrice = cart.totalPrice + productPrice;


      // analysing the cart => finding existing product
      const exisitingProductIndex = cart.products.findIndex(prod => prod.id === id);
      const exisitingProduct = cart.products[exisitingProductIndex];
      let updatedProduct;

      // add new product / incraese the quantity
      if(exisitingProduct) {
        updatedProduct = {...exisitingProduct};
        updatedProduct.qty = updatedProduct.qty + 1;
        // here also, we have to update the product in the cart. as product is already present here, we need to find the index where it is located
        cart.products = [...cart.products];
        cart.products[exisitingProductIndex] = updatedProduct;
      } else {
        updatedProduct = {id: id, qty: 1};
        // updating the cart after adding new product to the cart
        cart.products = [...cart.products, updatedProduct]; 
      }

      // productPrice is acting as a string here, to convert into number type, we are adding "+" operator before varible name
      cart.totalPrice = cart.totalPrice + +productPrice;

      // writeing down the changes to file
      fs.writeFile(p, JSON.stringify(cart), err => {
        console.log(err);
      });

    });

  }
}