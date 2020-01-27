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
  }
})

// importing the model
// model() is the function we call, model is important for mongoose behind the sceans to connect a schema with the name. it mean that, model will accept two agruments 
// 1st: name of schema which will be reflected in database 2nd: schema which is to be imported
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





