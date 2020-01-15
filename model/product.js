const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');

module.exports = class Product {

  constructor(t) {
    this.title = t;
  }
  save() {
    const p = path.join(rootDir, 'data', 'products.json')
    let products = [];
    fs.readFile(p, (err, fileContent) => {
      if (!err) {
        products = JSON.parse(fileContent);
      }
        products.push(this);
  
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err);
  
      });
    })
    
  }

  // this function is running asyn code
  // it will store both the function but will not execute 1.const p = path.join 2.fs.readFile(p, (err, fileContent), thus function does not return anything
  // hence, undefined will be passed from fetchAll(). thus in "shop.ejs", after passing value to shop.ejs. our condition becaome (undefined.length > 0)

  // static fetchAll() {
  //   const p = path.join(rootDir, 'data', 'products.json')

  //   fs.readFile(p, (err, fileContent) => {
  //     if(err) {
  //       return [];
  //     }
  //     return JSON.parse(fileContent);
  //   });

  // FIX
  // more info on callback handling: https://www.youtube.com/watch?v=jgWnccjXR4I
  // we are passing callback function, that actually allows me to pass a function into fetchAll() which fechAll will execute once it is done, so that thing calling fetchAll() can pass a function. it is then aware of being called which holds the data, we want to return

  //1. so we are reciving a function(cb), this argument will hold a function 
  static fetchAll(cb) {
    const p = path.join(rootDir, 'data', 'products.json')

    // expalation: readfile also takes a callback,we pass the fuction, which should be executed once it is done
    fs.readFile(p, (err, fileContent) => {
    if(err) {
      // 2.and therefoe instaed of returning an array, here we will execute callback function, which will pass empty array
      cb([]);  
    }
    // 3. same as step 2
    cb(JSON.parse(fileContent));
  });
    // running the server, we get 
    // Cannot read property 'length' of undefined
    // this error can be hard to debug


  }
}