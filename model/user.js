
const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

// goal: for every user, there should be a cart. every user will have cart and cart will hold products.
// mongodb is great place for embedded documents because we have strict one to one realtionship between user and the cart.  and so tere is no need to manage just with refference .
// thus deleteing cart and cart-item model.

// so in user model, we have to store our cart items.
// HOW?
// in controller/shop : see postCart, all the funtionalies we can apply in users model

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    // thus, now having cart property to user
    this.cart = cart;  // {items: [] }
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection('users').insertOne(this)
    .then(user => {
      // console.log(user);
      // return user
    })
    .catch(err => console.log(err));
  }

  // other then saving, we can save products of cart here
  // "product" we will get from postCart()
  addtoCart(product) {
    // logic: if product is already there or its new added product in cart
    // this function will be called on user object, and will create that object with data it fetch from database with the help of findById()
    // storing the cart item in constructore

    // after adding cart property, checking if product already exists in cart or not

    // finding the index of the product which is passed to cart
    // "findIndex" is the method whicgh takes a function. 
    // this function will iterate over "items" array and returns the index when it found the product.
    // if found it will gives us the index else if not found, it will give us "-1"(default)
    // const cartProduct = this.cart.items.findIndex(cp => {
    //   return cp._id === product.id;
    // })

    // assuming now, there will be no product in the cart. 
    // adding property to "product" object on the fly
    // product.quantity = 1
    // const updatedProduct = {items: [product]}

    // more cleaner way:
    // using spraed operator: extrating all the properties of this product into object of an array
    const updatedCart = {items : [{...product, quantity: 1}]};
    // "updatedCart" will create an object which holds an item property which is an array of only ine object(as of now) and with addatinal field 'quantity'

    // upadting the user to storethat cart
    // accessing the database
    const db = getDb();
    // upadating the particular user with help of its _id
    // 2nd argument: how to update. we want to kekp everything as it is except the cart where we have to add the product in it
    return db.collection('user').updateOne({_id: mongodb.ObjectId(this._id)}, {$set: {cart: updatedCart}});
    // thus, updatedCart will overwrite the previous value(as of now) and store it in user model
  

  }

  static findbyId(userId) {
    const db = getDb();
    return db.collection('users').findOne({_id: mongodb.ObjectId(userId)});
  }
}

module.exports = User;


