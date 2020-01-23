const getDb = require('../util/database').getDb;


class Product {
  constructor(title, imageUrl, price, description) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description= description;
  }

  save() {
    // connect to mongodb and save the product object. for that we will require mongodb connection
    // calling the connection and working on it
    // defing database
    const db = getDb();
    // databases => collection => documents
    // collection will tell tell on which collection we have to work.
    // defing colection
    // "products" is collecction name. if it is not there the just like dataabse, theu will get created
    // on the collection, we can execute mongo commads/operations. for more info on operations reffer mongodb docs :https://docs.mongodb.com/manual/crud/
    // "insertOne" will insert one object
    // "insertMany" will insert more than one object, in paranthese, it will take array where data can be inserted
    // db.collection('products').insertMany([<objects>])
    // EG:
    // db.collection('products').insertOne({name: 'A Book', price: 12.99})
    // "{name: 'A Book', price: 12.99}" this not JSON, but a JS object. but it will be converted by mongoDB


    // in our case: 
    db.collection('products').insertOne(this)
    // promise will be returned
    .then(result => {
      console.log(result); 
    })
    .catch(err => console.log(err));
  }
} 


