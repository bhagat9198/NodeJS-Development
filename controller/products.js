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

// no we will pass our fuction, where we will get our product
exports.getProduct = (req, res, next) => {
  // no need to store, as fetchAll will not return anything
  // const products = Product.fetchAll();

  Product.fetchAll((products) => {
    // instead of that, we will crete our own callback process, and we render in that function, where we pass it to fetchAll().
    // once i know that fetching all the product is done, and we recieve the product here because that is exactly the argument, we passed to callback.

    // "cb" argument will reffer to this anonmous function
    res.render("shop", {
      pageTitle: "Shop",
      prods: products, path: "/"
    });
  })
};

// expaliation: we have fetchAll() which takes function as an argument, which should executes once it done. once it done, it will get a product  and then we render our response with taht product
