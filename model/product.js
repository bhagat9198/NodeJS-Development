const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    // setting up something special 'ref' configration
    // ref congigration: it takes string where we tell mongoose that which other mongoose model is related to the data in that field.
    // as our type is ObjectId, so we have to tell which model objectId it has to take. Name of the model should be exactly same which we write in mongoose.model() method
    // we are reffereing user model
    ref: 'User'
    // thus, now our relation is setup.
  }
})


module.exports = mongoose.model('Product', ProductSchema);




// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;

// class Product {
//   constructor(title, imageUrl, price, description, id, userId) {
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.price = price;
//     this.description= description;
//     this._id = id ? mongodb.ObjectId(id) : null;
//     this.userId = userId;
//   }

//   save() {
//     const db = getDb();
//     let dbOp;
//     if(this._id) {
//       dbOp = db.collection('products').updateOne({_id: new mongodb.ObjectId(this._id)}, {$set: this})
//     } else {
//       dbOp =  db.collection('products').insertOne(this)
//     }
//     return dbOp
//     .then(result => {
//       // console.log(result);
//     })
//     .catch(err => console.log(err));
//   }

//   static fetchAll() {
//     const db = getDb();
//     return db.collection('products').find().toArray()
//     .then(products => {
//       return products;
//     })
//     .catch(err => console.log(err));
//   }

//   static findById(productId) {
//     const db = getDb();
//     return db.collection('products')
//     .find({_id: new mongodb.ObjectId(productId)})
//     .next()
//     .then(product => {
//       return product;
//     })
//     .catch(err => console.log(err));
//   }

//   static deleteById(productId) {
//     const db = getDb();
//     return db.collection('products').deleteOne({_id: mongodb.ObjectId(productId)})
//     .then(() => {
//       // console.log('deleted!!')
//     })
//     .catch(err => console.log(err));
//   }
// } 

// module.exports = Product;





