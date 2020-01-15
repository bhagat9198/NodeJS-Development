// ES5 way
// module.exports = function Product() {}


const products = [];

// ES6 : using concept of classes
module.exports = class Product {

  // constructor is used to give shape to the product
  constructor(t) {
    // creating a property within a class "title"
    // this allows us to create an object based in this class where we can pass the ttitle to the constructor, which we call with new and then this will get stored in created object
    // but we dont only create the object 
    this.title = t;
  }

  // but we want to store the product to our array product and fetch it when nessary

  // "save" is special function without a 'function' keyword
  // save method is avaliable in the class where we will save the products

  // "save()" should be called on instatited object pased on object
  save() {
    // "this" will reffer to the object created within a class, and that object we want to push to the product array
    products.push(this);
  }

  // after saving, we should able to retrive the products from the array product
  // "fetchAll" method is like utility function. this is not called on single instance of the product because because it should fetch all products and we dont want to create new object with new keyword with some dummy title, just to fech all existence product.
  // thus we will add "static " keyword, which make sure that we call this method directly on the class itself and no on any instanttiated object
  static fetchAll() {
    // "this.product" will return the current product and not the full array of products
    // return this.product;

    // we should return whole product array
    return products;
  }
}