
const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
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

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => { 
      return cp.productId.toString() == product._id.toString();
    })

    let newQuantity = 1;

    const updatedCartItems = [...this.cart.items];
    if(cartProductIndex >= 0 ){

      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      this.cart.items[cartProductIndex].quantity = newQuantity;  
    } else {

      updatedCartItems.push({
        productId: new mongodb.ObjectId(product._id),
        quantity: newQuantity
      });
    }
    const updatedCart = {
      items: updatedCartItems
    };

    const db = getDb();
    return db
      .collection('users')
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }


  static findbyId(userId) {
    const db = getDb();
    return db.collection('users').findOne({_id: mongodb.ObjectId(userId)});
  }

  // req.user is making the request. and user is always creating the user object. thus, no need to put static
  getCart() {
    // it will give all the products ids and their quantities for particular user. but in cart page, we have to show product name which is not present in 'this.cart'
    // return this.cart;
    // hece to show product details we have to refference to product model to extarct the information snf then give it to controller/shop which shows info on cart page

    // creating an array of products ids which are in cart
    const productIds = this.cart.items.map(i => {
      // iterating over each item object and extracting productId
      return i.productId;
    });
    // to access the products model, we need access to database
    const db = getDb();
    // connecting with 'products' model to extract info particulat products which are in cart.
    // find() method : it can set of set of filters and return the info based on that filters
    // $in will take an array of filter(in our case ids) and pass it one id at a time to '_id'
    // toArray() :converting cursor which is given by find() method to array
    return db.collection('products').find({_id: {$in: productIds}})
    .toArray()
    .then(products => {
      // products is the array which is containing all the details of cart prpduct ids
      // adding quantity field which is not present in products array
      return products.map(p => {
        return {
          ...p,
          quantity: this.cart.items.find(i => {
            return i.productId.toString() === p._id.toString();
          }).quantity
        };
        // thus now array will be passed and within it object for each producy with all its details and quantity
      });
    })
    .catch(err => console.log(err));
  }


}

module.exports = User;


