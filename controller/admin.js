const mongoose = require('mongoose');
const {validationResult} = require('express-validator')
 
const Product = require("../model/product");

exports.getAddProduct = (req, res, next) => {
  return res.render("admin/edit-product", {
    path: "/admin/add-product",
    pageTitle: "Add Products",
    editing: false,
    hasError: false,
    errorMessage: null,
    validationError: []
  });
};


exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const description = req.body.description;
  const price = req.body.price;
  const userId = req.user;

  if(!image) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description
      },
      errorMessage: ['Attach file is not a valid image file'],
      validationError: [{param: 'imageUrl'}]
    });
  }
  const imageUrl = image.path;
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description
      },
      errorMessage: errors.array()[0].msg,
      validationError: errors.array()
    });
  }

  const product = new Product({
    title: title,
    imageUrl: imageUrl,
    price: price,
    description: description,
    userId: userId,
  })
  // console.log(product);
  
  product.save()
  .then(product => {
    res.redirect('/admin/products');
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit
  if(!editMode) {
    res.redirect('/');
  }
  const productID = req.params.productID;
  return Product.findById(productID)
  .then(product => {
    return res.render("admin/edit-product", {
      path: "/admin/edit-product",
      pageTitle: "Edit Products",
      editing: editMode,
      product: product,
      hasError: false,
      errorMessage: null,
      validationError: []
    });
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });

};

exports.postEditProduct = (req, res, next) => {
  const productID = req.body.productID;
  const updatedTitle = req.body.title;
  const image = req.file;
  const updatedPrice = req.body.price;
  const upadatedDesciption = req.body.description;
  const errors = validationResult(req);
  console.log(image);
  
  console.log(errors);
  
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
        price: updatedPrice,
        description: upadatedDesciption,
        _id: productID
      },
      errorMessage: errors.array()[0].msg,
      validationError: errors.array()
    });
  }

  Product.findById(mongoose.Types.ObjectId(productID))
  .then(product => {
    if(product.userId.toString() !== req.user._id.toString()) {
      return res.redirect('/');
    }
    product.title = updatedTitle;
    product.price = updatedPrice;
    if(image) {
    product.imageUrl = image.path;
    }
    product.description = upadatedDesciption;
    return product.save()
    .then(() => {
      res.redirect('/admin/products');
    })
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};

exports.postDeleteProduct = (req, res, next) => {
  const productID = req.body.productID;

  Product.deleteOne({_id: productID, userId: req.user._id})
  .then(() => {
    res.redirect('/admin/products');
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};

exports.getProducts = (req, res, next) => {
  Product.find({userId: req.user._id})
  .then(products => {
    res.render("admin/products", {
      path: "/admin/products",
      pageTitle: "Admin Add Products",
      prods: products,
    });
  })
};






