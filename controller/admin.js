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
  // const imageUrl = req.body.image;
  const imageUrl = req.file;
  const description = req.body.description;
  const price = req.body.price;
  const userId = req.user;

  console.log(imageUrl);
  // thus it gives all the data
  // {
  //   fieldname: 'image', <- form field name
  //   originalname: 'lostbook.jpg', <- name of the image
  //   encoding: '7bit',
  //   mimetype: 'image/jpeg',  <- type of the file(jpeg/img/jpg)
  //   buffer: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 00 00 01 00 01 00 00 ff db 00 43 00 06 04 05 06 05 04 06 06 05 06 07 07 06 08 0a 10 0a 0a 09 09 0a 14 0e 0f 0c ...  <- stream of buffer
  // 35973 more bytes>,
  //   size: 36023
  // }

  // after adding 'dest' agrument to mutler method. 'images' folder will be created as we give destination as 'images'. now we cant see buffer as it is storing the file thus buffer is automatically convereted in bineray data.
  // {
  //   fieldname: 'image',
  //   originalname: 'lostbook.jpg',
  //   encoding: '7bit',
  //   mimetype: 'image/jpeg',
  //   destination: 'images',
  //   filename: '58752e01558540d0294dc03296123c18', <- random hash value
  //   path: 'images\\58752e01558540d0294dc03296123c18',
  //   size: 36023
  // }

  // image which is stored in "images" folder is saved without extenstion. thus adding the extension manually. in my case its 'jpg'.

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
        imageUrl: imageUrl,
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
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const upadatedDesciption = req.body.description;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
        imageUrl: updatedImageUrl,
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
    product.imageUrl = updatedImageUrl;
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






