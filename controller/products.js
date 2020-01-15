const Product = require("../model/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/addProduct", {
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

exports.getProduct = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/productList", {
      pageTitle: "Shop",
      prods: products, path: "/"
    });
  })
};

