
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
      // as we have to find out product id which is in an cart(object)->items(array) -> index(object) -> productId(attribute)
      // so it will go through array index object and check its attributes 
      return cp.productId.toString() == product._id.toString();
      // return cp.productId == product._id;  //error     
    })

    let newQuantity = 1;
    // for current user, we 
    const updatedCartItems = [...this.cart.items];
    // console.log(updatedCartItems);
        // [
        //   { productId: 5e2c5965222cfd53c47c2e3a, quantity: 7 },
        //   { productId: 5e2d7ac795c8053190f7c03b, quantity: 1 }
        // ]
    
    if(cartProductIndex >= 0 ){
      // if product existes
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      this.cart.items[cartProductIndex].quantity = newQuantity;  
    } else {
      // appending at the end of araay
      updatedCartItems.push({
        productId: new mongodb.ObjectId(product._id),
        quantity: newQuantity
      });
    }

    // const updatedCart = {items : [{...product, quantity: 1}]};
    // only storing product id instead of whole product details

    // updated array is passed to items array
    const updatedCart = {
      items: updatedCartItems
    };
    // console.log(updatedCart);

    const db = getDb();
    return db
      .collection('users')
      .updateOne(
        // updating cart for particular user
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  static findbyId(userId) {
    const db = getDb();
    return db.collection('users').findOne({_id: mongodb.ObjectId(userId)});
  }
}

module.exports = User;


