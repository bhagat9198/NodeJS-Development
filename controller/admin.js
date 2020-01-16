const Product = require("../model/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    path: "/admin/add-product",
    pageTitle: "Add Products",
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
  // now lets say, we need to get additional confirmation by ensuring that people have to pass us so called "query parameters"in a url.
  // a query parameter can be added to any url by adding a question mark and then a key,value pair seprated by equal to sign(keyValue = valueValue)
  // in our case, Eg: http://localhost:3000/admin/edit-product/12?edit=true
  // and we can have multiple query parameters by seprating them with ampersand sign(&)
  // Eg: http://localhost:3000/admin/edit-product/12?edit=true&title=new
  // this "edit=true&title=new" is called as optinal data. this data is not to be in routes file, where we determine route for different files
  // but, we can check for query paramerters in our controllers
  // this is done by:-

  // "query" is inbuild propertly given by express
  // here we are checking key "edit" if it is passed in optianl data
  // so if "edit" value is set somewhere in query parameters, we will get response as "true"
  // the extrated value (ie, response) is always a string. so it will be "true" not true(bool value)
  // if it didnt get the key "edit", it will set to undefined that is false
  const editMode = req.query.edit
  // thus, now we will enter edit mode, only if it editMode is set, which we have done
  
  if(!editMode) {
    // well, it is redundant thing here. as we already know we are editing new product here
    res.redirect('/');
  }

  // so query parameters are used to tracking down users or some filters set on the page
  res.render("admin/edit-product", {
    path: "/admin/edit-product",
    pageTitle: "Edit Products",
    editing: editMode
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