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
    // returing the data, which we was inserted in database
    return db.collection('products').insertOne(this)
    .then(result => {
      console.log(result); 
    })
    .catch(err => console.log(err));
  }

  static fetchAll() {
    // accessing the db
    const db = getDb();

    // same like insert, defining database (which is already defined in getDb()) -> defining collection ->method/operation on the document

    // "find()" method will find all the data which is in collection
    // find() can also be configured as fliter ie finding specific data
    // find({title: 'ABook'}) : it will give out all the data , where this parameter "title: 'ABook'" is satisified

    // find() does not immediately return the promise, instead it returns so-called "cursor". A cursor is an object provided by mongo which allows us to go through our dcuments/elements step by step because otherwise find will return all the documents which are collection. and collection can have million of documents and those we cant transfer them all at once
    // so find() gives us a handle which we can use it to tell, to to give next document, then another.... so on.
    // "toArray" will take all the documents which it get and then convert into an JS array. but it should be used when we know, we have very few objects(max: 100). else use pagination

    return db.collection('products').find().toArray()
    .then(products => {
      console.log(products);
      // returning the products, as it will be used in controllers files
      return products;
    })
    .catch(err => console.log(err));
  }


} 

module.exports = Product;
