const mongoose = require('mongoose');

const Product = require('../model/product');
const Order = require('../model/order');

exports.getIndex = (req, res, next) => {
  Product.find()
  .then(products => {
    res.render("shop/index", {
      pageTitle: "Shop",
      prods: products,
      path: "/",
      isLoggedIn: req.session.isLoggedIn
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
      path: "/products",
      isLoggedIn: req.session.isLoggedIn
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
        path: '/products',
        isLoggedIn: req.session.isLoggedIn
      }
    );
  })
  .catch(err => console.log(err));
};


exports.getCart = (req, res, next) => {
  // this will not mean that it exists only for this request, the mongoose model is but its get the data taht is stored in the session and therefore, the data that continues to follow over multiple request
  req.user
  .populate('cart.items.productId')
  .execPopulate()
  .then(user => {
    const products = user.cart.items;
    // console.log(products);
    res.render('shop/cart', {
      pageTitle: 'Cart',
      path: '/cart',
      products: products,
      isLoggedIn: req.session.isLoggedIn
    });
  })
  .catch(err => {
    console.log(err);
  });
};


// "TypeError: req.session.user.addToCart is not a function"
// earlier setup, we stored the user directly inside req object. and for every request, we used to fetch user in middleway of app.js
// we fetch the userfrom the database and mongoose used to gives us fuller user object, not just the data in database but also all the methods defined in user model. and all that was stored in "req.user".active
// with session it works bit different. with the session, we are not fetching this for every request, instead we are storing the user in our session upon logging in
// controller/auth 
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
  Order.find({'user.userId': req.user._id})
  .then(orders => {
    // console.log(orders);
    res.render('shop/orders', {
      pageTitle: 'Orders',
      path: '/orders',
      orders: orders,
      isLoggedIn: req.session.isLoggedIn
    });
  })
  .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user
  .populate('cart.items.productId')
  .execPopulate()
  .then(user => {
    const products = user.cart.items.map(i => {
      return {quantity: i.quantity, product: {...i.productId._doc}};
    });
    console.log(products);
    const order = new Order({
      user: {
        username: req.user.username,
        userId: req.user
      },
      products: products
    });
    return order.save()
  })
  .then(result => {
    return req.user.clearCart();
  })
  .then(() => {
    res.redirect('/cart');
  })
  .catch(err => console.log(err));
};








