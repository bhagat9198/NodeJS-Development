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

  Product.create({
    title: title,
    imageUrl: imageUrl,
    price: price,
    description: description
  })
  .then(result => {
    console.log(result);
    console.log('product saved ');
    
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
  Product.findById(productID)
    .then(([row]) => {
      res.render("admin/edit-product", {
        path: "/admin/edit-product",
        pageTitle: "Edit Products",
        editing: editMode,
        product: row
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

  const updatedProduct = new Product(productID, updatedTitle, updatedImageUrl, upadatedDesciption, updatedPrice);
  updatedProduct.save();
  res.redirect('/admin/products');
};

exports.postDeleteProduct = (req, res, next) => {
  const productID = req.body.productID;
  Product.deleteById(productID);
  res.redirect('/admin/products');
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
  
  // Product.fetchAll((products) => {
  //   res.render("admin/products", {
  //     path: "/admin/products",
  //     pageTitle: "Admin Add Products",
  //     prods: products,
  //   });
  // })
};