const Product = require("../model/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/addProduct", {
    path: "/admin/add-product",
    pageTitle: "Add Products",
  });
};

exports.postAddProduct = (req, res, next) => {
  // const product = new Product(req.body.title);
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = req.body.price;
  const product = new Product(title, imageUrl, description, price);
  product.save();

  console.log("admin.js ", product);
  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  res.render("admin/products", {
    prods: Product,
    path: "/admin/products",
    pageTitle: "Admin Add Products",
  });
};