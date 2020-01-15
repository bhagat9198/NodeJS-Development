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
  // console.log(productID);
  Product.findById(productID, product => {
    res.render('shop/product-detail', { pageTitle: product.title, product: product, path: '/products' });
  });

};

exports.getCart = (req, res, next) => {
  res.render('shop/cart', {
    pageTitle: 'Cart',
    path: '/cart'
  });
};

exports.postCart = (req, res, next) => {
  // as request was "POST", so it contains the productID as agrument within the url of "form" 
  // "productID" is the name given to the value ID, in the form field.
  console.log(req.body.productID);
  res.redirect('/');
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    pageTitle: 'Orders',
    path: '/orders'
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



