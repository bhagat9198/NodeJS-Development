const Product = require('../model/product');

exports.getIndex = (req, res, next) => {
  // there is no fechAll() inbuild function in mongoose, but we can use static method

  // find() method when used with mongoose, works bit diffrently. 
  // find() with mongodb gives us cursor, but it mongoose it just gives us all items in array format. 
  // but if document is huge, we can use cursor(gives obe document at a time)
  // Eg : Product.find().cursor().next()
  Product.find()
  .then(products => {
    res.render("shop/index", {
      pageTitle: "Shop",
      prods: products,
      path: "/"
    });
  })
  .catch(err => console.log(err));

  // Product.fetchAll()
  // .then(products => {
  //   res.render("shop/index", {
  //     pageTitle: "Shop",
  //     prods: products,
  //     path: "/"
  //   });
  // })
  // .catch(err => console.log(err));
};


exports.getProduct = (req, res, next) => {
  Product.find()
  .then(products => {
    res.render("shop/index", {
      pageTitle: "Shop",
      prods: products,
      path: "/products"
    });
  })
  .catch(err => console.log(err));


  // Product.fetchAll()
  // .then(products => {
  //   res.render("shop/product-list", {
  //     pageTitle: "Shop Products",
  //     prods: products,
  //     path: "/products"
  //   });
  // })
  // .catch(err => console.log(err));
};

exports.getDetails = (req, res, next) => {
  const productID = req.params.productId;
  Product.findById(productID)
  .then(product => {
    res.render(
      'shop/product-detail',
      {
        pageTitle: product.title,
        product: product,
        path: '/products'
      }
    );
  })
  .catch(err => console.log(err));
};


exports.getCart = (req, res, next) => {
  req.user.getCart()
  .then(products => {
    res.render('shop/cart', {
      pageTitle: 'Cart',
      path: '/cart',
      products: products
    });
  })
  .catch(err => {
    console.log(err);
  });
};

exports.postCart = (req, res, next) => {
  const productID = req.body.productId
  Product.findById(productID)
  .then(product => {
    return req.user.addToCart(product)
  })
  .then(result => {
    res.redirect('/cart');
  })
  .catch(err => console.log(err));
}

exports.postCartDeleteProduct = (req, res, next) => {
  const productID = req.body.productId;

  req.user.deleteItemsFromCart(productID)
  .then((result) => {    
    res.redirect('/cart');
  })
  .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user.getOrders()
  .then(orders => {
    res.render('shop/orders', {
      pageTitle: 'Orders',
      path: '/orders',
      orders: orders
    });
  })
  .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user.addOder()
  .then(() => {
    res.redirect('/');
  })
  .catch(err => console.log(err));

};







