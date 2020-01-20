const Product = require("../model/product");

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
  const product = new Product(req.body.title);
  product.save();

  console.log("admin.js ", product);
  res.redirect("/");
};

exports.getproduct = (req, res, next) => {
  const products = Product.fetchAll();
  res.render("shop", {
    pageTitle: "Shop",
    prods: products, path: "/"
  });
};
