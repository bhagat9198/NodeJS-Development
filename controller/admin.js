const Product = require("../model/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    path: "/admin/add-product",
    pageTitle: "Add Products",
  });
};

// creating variable, which can store a number
// let numID = 0;

exports.postAddProduct = (req, res, next) => {
  // let numID = Math.random();
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = req.body.price;
  // numID will be incremented by one, whenever new product will be added
  // numID = numID + 1;

  const product = new Product(title, imageUrl, description, price);
  
  product.save();
  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      path: "/admin/products",
      pageTitle: "Admin Add Products",
      prods: products,
    });
  })
};