
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

  getOder() {
    const db = getDb();
    // till now we are only storing the product ids and their quantities but we also want to add user and prodyct details.
    // const orders = {
    //   items: this.cart.items,
    //   user: {
    //     username: this.username,
    //     email: this.email
    //   }
    // }
    // thus we have successfully added user details but product details are still left.
    // we know that, getChrt() method is having allthe details of products. hence calling it
    // returning it, as controller/shop have promised attached while calling this function
    return this.getCart()
    .then(products => {
      // 'products' : array of products with all info
      // 'products' will contain all the details of all the cart products
      // thus, now creting orders here
      const orders = {
        // items -> products and not just 'this.cart.items'
        items: products,
        user: {
          username: this.username,
          email: this.email
        }
      }
      // once 'orders' is having all the details, saving it to database
      return db.collection('orders').insertOne(orders)
    })
    // once, storing is done successfully, another promse to make the cart empty
    .then(orders => {
      this.cart = {items: []};
      db.collection('users').updateOne(
        { _id: mongodb.ObjectId(this._id)},
        { $set : {cart: {items: []}}} 
      );
    })
    .catch(err => console.log(err));   
  }

}

module.exports = User;


