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

  // 2nd method: setting up userId automatiacally when product is added
  // createProduct method is in sequelize which comes handy while we are dealing with associations
  // as we are using "belongsTo", sequelize gives us "createProduct()" which helps us to create new associated object. 
  // so since user has many products or many products are belongs to a user as we defined in app.js ie, "Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});"
  // "createProduct" because our model is names 'Product' and 'create' is automatiaclly added to 'product'
  // req.user.createProduct(<passing the object product which is to be craeted);

  req.user.createProduct({
    title: title,
    imageUrl: imageUrl,
    price: price,
    description: description
  })
  // Product.create({
  //   // as we have set the association that all the products are related to customers
  //   title: title,
  //   imageUrl: imageUrl,
  //   price: price,
  //   description: description

  //   // 1st way: setting up user id
  //   // setting up user id
  //   // req.user is sequelize user object which holds both user database and and helper methods.
  //   // this will create a new project with that user being associated to it.
  //   // "userId" is the field created in the "products" table. 
  //   // userId : req.user.id
  //   // this is the not elegant way of setting up userId as we are doing it manually.
  // })
  .then(result => {
    // console.log(result);
    console.log('product saved ');
    res.redirect('/admin/products');
  })
  .catch(err => {
    console.log(err);
  });

};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit
  if(!editMode) {
    res.redirect('/');
  }
  const productID = req.params.productID;

  Product.findByPk(productID)
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

  Product.findByPk(productID)
  .then(product => {
    product.title = updatedTitle;
    product.imageUrl = updatedImageUrl;
    product.price = updatedPrice;
    product.description = upadatedDesciption;

    product.save()
  })
  .then(() => {
    res.redirect('/admin/products');  
  })
  .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const productID = req.body.productID;
  Product.findByPk(productID)
  .then(product => {
    product.destroy()
  })
  .then(() => {
    res.redirect('/admin/products');
  })
  .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
  .then(products => {
    res.render("admin/products", {
      path: "/admin/products",
      pageTitle: "Admin Add Products",
      prods: products,
    });
  })
  .catch(err => {
    console.log(err);
  });
};