const mongoose = require('mongoose');
const Product = require('../model/product');

exports.getIndex = (req, res, next) => {
  Product.find()
  .then(products => {
    res.render("shop/index", {
      pageTitle: "Shop",
      prods: products,
      path: "/"
    });
  })
  .catch(err => console.log(err));
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
};

exports.getDetails = (req, res, next) => {
  const productID = req.params.productId;
  Product.findById(mongoose.Types.ObjectId(productID))
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
  // req.user.cart is a object within which we have product Ids and their quantites. so, we have to populate this with product info.

  req.user
  .populate('cart.items.productId')
  // populate() doesnt give the promise, so using execPopulate() method after promise which will give us promise
  .execPopulate()
  // it will give us user model data along with product details which are in cart
  .then(user => {
    // product details will be present within productId as a object
    // user -> cart -> items -> productId -> {product details}
    const products = user.cart.items
    console.log(products);
    res.render('shop/cart', {
      pageTitle: 'Cart',
      path: '/cart',
      products: products
    });
  })
  .catch(err => {
    console.log(err);
  });


  // req.user.getCart()
  // .then(products => {
  //   res.render('shop/cart', {
  //     pageTitle: 'Cart',
  //     path: '/cart',
  //     products: products
  //   });
  // })
  // .catch(err => {
  //   console.log(err);
  // });
};

exports.postCart = (req, res, next) => {
  const productID = req.body.productId;
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







