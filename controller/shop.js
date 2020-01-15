const Product = require("../model/product");

exports.getProduct = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/productList", {
      pageTitle: "Shop Products",
      prods: products,
      path: "/products"
    });
  })
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



