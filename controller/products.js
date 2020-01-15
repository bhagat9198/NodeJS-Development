// no need of this, we have our "model" file
// const products = [];

// Product(P is uppercase), this is because it is convention to use class variable with upper case
const Product = require("../model/product");

// now we willcreate a new object based on class blueprint

exports.getAddProduct = (req, res, next) => {
  res.render("addProduct", {
    path: "admin/add-product",
    pageTitle: "Add Products",
    activeAddProduct: true,
    formsCSS: true,
    productCSS: true
  });
};

exports.postAddProduct = (req, res, next) => {
  // no use, we will create new object to the class and pass the value to it
  // products.push({'title' : req.body.title});

  // in form field of 'addProduct.ejs' , there "name= title". thus writing "req.body.title"
  const product = new Product(req.body.title);
  product.save();

  // after craeting the new product object, we need to save that by calling save() method of the clas
  console.log("admin.js ", product);
  res.redirect("/");
};

exports.getproduct = (req, res, next) => {
  // we are just calling static method and not craeting any object with dummy text, as we alraedy have an product array in 'model' where we are storing all the products
  const products = Product.fetchAll();
  res.render("shop", {
    pageTitle: "Shop",
    prods: products, path: "/"
  });
  // console.log('shop.js ', products);
};
