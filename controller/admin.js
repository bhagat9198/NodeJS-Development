const Product = require("../model/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/addProduct", {
    path: "/admin/add-product",
    pageTitle: "Add Products",
  });
};

exports.postAddProduct = (req, res, next) => {
  // no need of this, as we are storing all the aguments (title, imageUrl, description, price) and then passing it to constructor of a class, to create a new object
  // const product = new Product(req.body.title);

  // ".title, .imageUrl, .description, .price" should be the same name as given in form field of html page. eg: name="title"
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = req.body.price;

  // arguments should be passed in same order as done in constructor
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