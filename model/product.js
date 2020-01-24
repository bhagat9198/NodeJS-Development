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
    let dpOp;

    if(this._id) {
      // updateMany: will update many products at once
      // updateOne({},{}) : 1st argument will take the 'id' where we have to update. 2nd argument will take the data which should be updated over exisiting data.both the agruments will be passed as JS object
      // 2nd argument will specify how to update. thus is now not a new object so we cant specifiy "this"
      // "dpOp =  db.collection('products').updateOne({_id: mongodb.ObjectId(this._id)}, this)" : this means that finding the existing document and replace is with new object which we passed with 'this' keyword. UpdateOne does not rerplace, instead we have to describe the opearation.
      // describing the operations is done with specaial property name which is understood by mongodb as a reserve name "$set"
      // "$set: {}" will again take object as a value and there we describe the changes we want to make to the exisiting document which we found. updating the values more verbosly
      // "dpOp =  db.collection('products').updateOne({_id: mongodb.ObjectId(this._id)}, {$set: {title: this.title, price: this.price}})"

      // "{$set: this}" here saying "this" means that we instruct simply take key value pairs of constructor of the class to the document found in database. as we are reaplacing all the fields so 'this' will reaplace the all
      dpOp =  db.collection('products').updateOne({_id: mongodb.ObjectId(this._id)}, {$set: this})
    } else {
      dpOp =  db.collection('products').insertOne(this)
    }
    return dpOp
    .then(result => {
      console.log(result); 
    })
    .catch(err => console.log(err));
  }

  static fetchAll() {
    const db = getDb();
    return db.collection('products').find().toArray()
    .then(products => {
      console.log(products);
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
      console.log(product);
      return product;
    })
    .catch(err => console.log(err));
  }
} 

module.exports = Product;
