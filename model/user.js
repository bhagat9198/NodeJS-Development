
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
    // first we have to get all the product ids which are in cart

    // const updatedCart = [...this.cart.items]
    // more cleaner way
    // filter() is the method provided by vanilla JS, which define us to criteria on how we want to filter elements in that array(in this case 'items' array). then it will give out new array with all the filltered items
    // there will be function within filter method with will do the filtering
    const updatedCart = this.cart.items.filter(item => {
      // if it return true, item will get stored in new array
      // if it return false, it will be not included in new array
      
      // in our case, we want to keep all the product id, except the id, for which we are deleting the element. hece, "!=="
      // for the products whose id didnt match will be stored in new array
      return item.productId.toString() !== productId.toString();
    });

    // after deleting the particular id, updating the database.
    // thus, accessing the databse
    const db = getDb();
    return db.collection('users').updateOne(
      { _id: mongodb.ObjectId(this._id)},
      // cart -> items -> array containing product ids and quantity
      { $set : {cart: {items: updatedCart}}} 
    );
  }

}

module.exports = User;


