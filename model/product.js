// creating model with mongoose
// to use mongoose, first we have to require it
const mongoose = require('mongoose');
// importing schema constructor from mongoose object. this schema constructor will help us to build schema
const Schema = mongoose.Schema;
// even thuogh mongodb is schemaless, still we are using schema??
    // wlthough while not getting restricted to specific schema, we often will have certain structure in the data we work with. so mongoose wants us give us the advantage of focing our data and for that mongoose should know on how our data looks like and so we dedine certain schema
    // but after defining schema, we can still diviate from it. so schema are forced once we define them 
// crearting new schema by instatiating schema object with help of 'new; keyword
// now, within this schema constructor, passing JS object and that object will define our schema ie how our schema should look like 
const ProductSchema = new Schema({
  // within JS object, its normal key-value pairs.
  // defining key as well as its 'type' as value
  title: {
    // 'string' is default JS object
    type: String,
    required: true
  },
  // shorthand way to represent type of data
  // imageUrl: String,
  imageUrl: {
    // this more complex way of arraging our data, thus giving up some freedom. as in this case, now it nessary to give 'imageurl' while creating new product 
    // thus, giving up some freedom and gaining other advantages
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
  // note that we didnt specify the '_id' : this is because still _id field will be generated automatically
})



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





