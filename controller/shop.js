const Product = require("../model/product");

exports.getProduct = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      pageTitle: "Shop Products",
      prods: products,
      path: "/products"
    });
  })
};

exports.getDetails = (req, res, next) => {
  const productID = req.params.productId;
  console.log(productID);
  Product.findById(productID, pro => {
    console.log(pro);
  });
  res.redirect('/');

};

exports.getCart = (req, res, next) => {
  res.render('shop/cart', {
    pageTitle : 'Cart',
    path : '/cart'
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    pageTitle : 'Orders',
    path : '/orders'
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      pageTitle: "Shop",
      prods: products,
      path: "/"
    });
  })
};



