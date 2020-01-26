
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

  getCart() {
    const productIds = this.cart.items.map(i => {
      return i.productId;
    });
    const db = getDb();
    return db.collection('products').find({_id: {$in: productIds}})
    .toArray()
    .then(products => {
      return products.map(p => {
        return {
          ...p,
          quantity: this.cart.items.find(i => {
            return i.productId.toString() === p._id.toString();
          }).quantity
        };
      });
    })
    .catch(err => console.log(err));
  }


  deleteItemsFromCart(productId) {
    const updatedCart = this.cart.items.filter(item => {
      return item.productId.toString() !== productId.toString();
    });

    const db = getDb();
    return db.collection('users').updateOne(
      { _id: mongodb.ObjectId(this._id)},
      { $set : {cart: {items: updatedCart}}} 
    );
  }

  // adding funtionality to add products to orders
  // we can put orders with particular user database, but orders history can get long so it will be difficult to manage. 
  // thus creating new collection 'orders' but execution funtion in user's model
  // again no need to put static keyword, as user is creating new object 
  getOder() {
    // getting all the products which are in cart
    const orders = this.cart;

    // after getting the orders, we have to store those products in 'orders' collection and deleting the items from cart
    // accessing the database
    const db = getDb();
    // before clearing products from user cart, we need to store all those products in new collevtion 'orders'
    return db.collection('orders').insertOne(this.cart)
    .then(orders => {
      // clearing the current user cart object
      // this.cart.items = [];
      // or 
      this.cart = {items: []};
      // now claering from the database
      db.collection('users').updateOne(
        { _id: mongodb.ObjectId(this._id)},
        { $set : {cart: {items: []}}} 
      );
    })
  }

}

module.exports = User;


