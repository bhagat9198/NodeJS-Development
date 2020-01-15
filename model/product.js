// no more array, as we will store all our products in a file
// const products = [];

const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');

module.exports = class Product {

  constructor(t) {
    this.title = t;
  }
  save() {
    // no more pushing elements to array
    // products.push(this);

    // creating a file
    // if u dont want to use, "path" file which is in util folder, directly use the command, which we have provided in "path" file of util folder
    // const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');

    // we will store file in JSON format
    const p = path.join(rootDir, 'data', 'products.json')

    // to store the new product, first we need to get existing products and then store new product at the end
    // so, first we read the file
    // for large file, we will not read file.ie, not putting the file in memory. we will be reading as a stream
    // fs.createReadStream()

    // but our file will be shorter, we will read the file
    // function in second argument will be executed when reading of file is done 
    fs.readFile(p, (err, fileContent) => {
      // console.log(fileContent);

      //if we run the server, we will get 
      // ReferenceError: products is not defined  at "shop.js"
      // we got an error because, we dont have any file... so no content

      // now, if we see error 
      // console.log(err);
      // in console, we can see
      // "undefined"
      // [Error: ENOENT: no such file or directory, open 'D:\My\vscode\node\5.express\data\products.json'] {
      //   errno: -4058,
      //   code: 'ENOENT',
      //   syscall: 'open',
      //   path: 'D:\\My\\vscode\\node\\5.express\\data\\products.json'
      // }


      let products = [];
      if (!err) {
        // parse method will takes incoming JSON data and gives back js array or object or whatever is there in a file
        products = JSON.parse(fileContent);
      }
      // as we are using arrow function, it will reffer to the class. if we will use "function"(es5), it will losse its context and will not reffer to the class
      // "this" refferes to the current object of the class 
      products.push(this);

      // after pushing to array, now we should save it to the file
      // "stringify" method will take js object/arary and convert it into JSON format
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err);
        // we will still get an error, as we are not outputting anything. but we get 
        // "null"
        // but in data folder, "products.json" is craeted where we can see the one object created in form of JSON

      });
    })
  }

  static fetchAll() {
    const p = path.join(rootDir, 'data', 'products.json')

    // after stroing it in file, we should reterive the data
    fs.readFile(p, (err, fileContent) => {
      if(err) {
        // if error is there, it will simply gives empty array and comes out of function
        return [];
      }
      // convert json to JS form and pront it out
      return JSON.parse(fileContent);
    });

    // running the server, we get 
    // Cannot read property 'length' of undefined
    // this error can be hard to debug
  }
}