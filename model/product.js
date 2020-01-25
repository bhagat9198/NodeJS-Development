const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Product {
  constructor(title, imageUrl, price, description, id) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description= description;
    this._id = id;
  }

  save() {
    const db = getDb();
    let dbOp;
    console.log(this._id)
    if(this._id) {
      console.log(this._id)
      
      dbOp =  db.collection('products').updateOne({ _id : new mongodb.ObjectId(this._id) }, { $set: {title: this.title, price: this.price}});
      // dbOp = db.collection('products').updateOne({_id: new mongodb.ObjectId(this._id)}, {$set: this})
      console.log(this._id)


    } else {
      console.log(this._id)
      dbOp =  db.collection('products').insertOne(this)
    }
    return dbOp
    .then(result => {

      // console.log(result); 
      // return result;
    })
    .catch(err => console.log(err));
  }

  static fetchAll() {
    const db = getDb();
    return db.collection('products').find().toArray()
    .then(products => {
      // console.log(products);
      return products;
    })
    .catch(err => console.log(err));
  }

  static findById(productId) {
    const db = getDb();
    return db.collection('products')
    .find({_id: new mongodb.ObjectId(productId)})
    .next()
    .then(product => {
      // console.log(product);
      return product;
    })
    .catch(err => console.log(err));
  }
} 

module.exports = Product;





