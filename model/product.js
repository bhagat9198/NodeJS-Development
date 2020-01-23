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
} 

module.exports = Product;
