const Product = require("../model/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/addProduct", {
    path: "/admin/add-product",
    pageTitle: "Add Products",
  });
};

exports.postAddProduct = (req, res, next) => {
  const product = new Product(req.body.title);
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