const Product = require("../model/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    path: "/admin/add-product",
    pageTitle: "Add Products",
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = req.body.price;

  const product = new Product(title, imageUrl, description, price);
  
  product.save();
  res.redirect("/");
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit
  if(!editMode) {
    res.redirect('/');
  }

  // taking out productID from the dynamic parameters which we are passing in url
  const productID = req.params.productID;
  // console.log(productID);

  Product.findById(productID, product => {
    res.render("admin/edit-product", {
      path: "/admin/edit-product",
      pageTitle: "Edit Products",
      editing: editMode,
      product: product
    });
  });
  
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