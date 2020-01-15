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
  // we can access productID because of "params" object which express gives on the request
  // "productID" is same give in "routes" folder of "shop". both the same should be same, to access that property
  const productId = req.params.productID;
  console.log(productId);
  // redirecting the result
  res.redirect('/');
  //  we not only store the productID, but we can use it to do other work
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



