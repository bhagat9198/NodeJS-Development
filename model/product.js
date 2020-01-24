const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Product {
  constructor(title, imageUrl, price, description) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description= description;
  }

  save() {
    const db = getDb();
    return db.collection('products').insertOne(this)
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

    // using "find({})" as filter. using find as filter still gives us cursor although it will gives us only one element.
    // next() function will go to next function after reading first element and in this case first is last last element which is rerturned by find
    // "find({ _id:productId })" will give us "null" value which means it didnt find any product.
    // as we know mongodb stores data in BSON format. this binery format of JSON is not just used because its faster to work with but also becasuse mangodb can storesome special type of datain there. and "_id" is such a type.
    // its a type added by mongodb, its not default JS type. its doesnt existes in JS type at all.
    // {"_id": ObjectId("5e29d9603a8e4956301daebd")} : it is simply ID object which moongodb uses  beacuse this generates and manages id's which look random but thet arn't. so ID's are created in a way that we we create id now and then 1 second later. 2nd id will be alphabetically higher value then first one
    
    // so, we cant compare "_id: productId" as both types are different. "_id" :will conatain object Id and "productId" will contain the string.
    // it will not comapare only id ["5e29d9603a8e4956301daebd"], but whole object Id ie, "ObjectId("5e29d9603a8e4956301daebd")"

    // thus, to compare while objectId:
    // "new" keyword will create a construtor for object
     return db.collection('products').find({_id: new mongodb.ObjectId(productId)})
    .next()
    .then(product => {
      console.log(product);
      return product;
    })
    .catch(err => console.log(err));
  }
} 

module.exports = Product;
