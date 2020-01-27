const mongoose = require('mongoose');

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
  const userId = req.user;

  const product = new Product({
    title: title,
    imageUrl: imageUrl,
    price: price,
    description: description,
    userId: userId
  })
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

  Product.findById(mongoose.Types.ObjectId(productID))
  .then(product => {
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.imageUrl = updatedImageUrl;
    product.description = upadatedDesciption;
    return product.save()
  })
  .then(() => {
    res.redirect('/admin/products');
  })
  .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const productID = req.body.productID;

  Product.findByIdAndDelete(productID)
  .then(() => {
    res.redirect('/admin/products');
  })
  .catch(err => {
    console.log(err);
  })
};

exports.getProducts = (req, res, next) => {
  Product.find()
  // incase if we dont want all the fields to be displayed or retervied from database. to do that we can write queries, but mongoose gives us select() method
  // select(): attritubtes we specify will be retervied from database. and to forcefully omit attributes(eg: _id which get retervied automatically) put '-' sign beforethe attribute name
  // if there are more then one attribute, seprate them by space. all the attrbutes are inclosed in quotes
  .select('title price -_id')
  // we know that each product is assigned with user. we in product model we are only storing userId. but if we need other info of user while displaying product, either we can write queries or mongoose gives us 'populate()' method
  // populate():it accepts a attribute which is reffered to other model and whos detail we want to see
  // but if we only need selected info, in 2nd argument: we can pass the attributes which we want to see/work with
  .populate('userId', 'username email -_id')
    .then(products => {
      console.log(products);
      
      res.render("admin/products", {
        path: "/admin/products",
        pageTitle: "Admin Add Products",
        prods: products,
      });
    })
};






