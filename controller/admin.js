const Product = require("../model/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    path: "/admin/add-product",
    pageTitle: "Add Products",
    editing: false
  });
};
// storing the product along with user id 
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = req.body.price;
  // here "req.user._id" will be just a string because when reterving the data the object id is convereted to the strings 
  const userId = req.user._id;
  // storing the userid who is adding the product
  // we can access user with the help of req ibject which is holding the data 
  const product = new Product(title, imageUrl, price, description, null, userId);

  product.save()
  .then(product => {
    res.redirect('/admin/products');
  })
  .catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit
  if(!editMode) {
    res.redirect('/');
  }
  const productID = req.params.productID;
  Product.findById(productID)
  .then(product => {
    res.render("admin/edit-product", {
      path: "/admin/edit-product",
      pageTitle: "Edit Products",
      editing: editMode,
      product: product
    });
  })
  .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const productID = req.body.productID;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const upadatedDesciption = req.body.description;

  const updatedProduct = new Product(updatedTitle, updatedImageUrl, updatedPrice, upadatedDesciption,productID);
  updatedProduct.save()
  .then(() => {
    res.redirect('/admin/products');
  })
  .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const productID = req.body.productID;
  Product.deleteById(productID)
  .then(() => {
    res.redirect('/admin/products');
  })
  .catch(err => {
    console.log(err);
  })
};

exports.getProducts = (req, res, next) => {

  Product.fetchAll()
  .then(products => {
    res.render("admin/products", {
      path: "/admin/products",
      pageTitle: "Admin Add Products",
      prods: products,
    });
  })
  .catch(err => console.log(err));
};






