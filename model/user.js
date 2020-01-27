
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  items: {
    type: [{
      productId: {
        type: Schema.Types.ObjectId,
        // setting up relation with Product model
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }]
  }
})

module.exports = mongoose.model('User', UserSchema);






// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;

// class User {
//   constructor(username, email, cart, id) {
//     this.username = username;
//     this.email = email;
//     this.cart = cart;  // {items: [] }
//     this._id = id;
//   }

//   save() {
//     const db = getDb();
//     return db.collection('users').insertOne(this)
//     .then(user => {
//       // console.log(user);
//       // return user
//     })
//     .catch(err => console.log(err));
//   }

//   addToCart(product) {
//     const cartProductIndex = this.cart.items.findIndex(cp => { 
//       return cp.productId.toString() == product._id.toString();
//     })

//     let newQuantity = 1;

//     const updatedCartItems = [...this.cart.items];
//     if(cartProductIndex >= 0 ){

//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       this.cart.items[cartProductIndex].quantity = newQuantity;  
//     } else {

//       updatedCartItems.push({
//         productId: new mongodb.ObjectId(product._id),
//         quantity: newQuantity
//       });
//     }
//     const updatedCart = {
//       items: updatedCartItems
//     };

//     const db = getDb();
//     return db
//       .collection('users')
//       .updateOne(
//         { _id: new mongodb.ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//       );
//   }


//   static findbyId(userId) {
//     const db = getDb();
//     return db.collection('users').findOne({_id: mongodb.ObjectId(userId)});
//   }

//   getCart() {
//     const productIds = this.cart.items.map(i => {
//       return i.productId;
//     });
//     const db = getDb();
//     return db.collection('products').find({_id: {$in: productIds}})
//     .toArray()
//     .then(products => {
//       return products.map(p => {
//         return {
//           ...p,
//           quantity: this.cart.items.find(i => {
//             return i.productId.toString() === p._id.toString();
//           }).quantity
//         };
//       });
//     })
//     .catch(err => console.log(err));
//   }


//   deleteItemsFromCart(productId) {
//     const updatedCart = this.cart.items.filter(item => {
//       return item.productId.toString() !== productId.toString();
//     });

//     const db = getDb();
//     return db.collection('users').updateOne(
//       { _id: mongodb.ObjectId(this._id)},
//       { $set : {cart: {items: updatedCart}}} 
//     );
//   }

//   addOder() {
//     const db = getDb();
//     return this.getCart()
//     .then(products => {
//       const orders = {
//         items: products,
//         user: {
//           id: this._id,
//           username: this.username,
//           email: this.email
//         }
//       }
//       return db.collection('orders').insertOne(orders)
//     })
//     .then(orders => {
//       this.cart = {items: []};
//       db.collection('users').updateOne(
//         { _id: mongodb.ObjectId(this._id)},
//         { $set : {cart: {items: []}}} 
//       );
//     })
//     .catch(err => console.log(err));   
//   }

//   getOrders() {
//     const db = getDb();
//     return db.collection('orders').find({'user.id': new mongodb.ObjectId(this._id)}).toArray()
//   }
// }

// module.exports = User;


