const mongoose = require('mongoose');

const Product = require('../model/product');
const Order = require('../model/order');

// if we are on home page and we are logged in and from there we want to logout. as we know logout will make post request. thus we have to put csrf token in "getIndex" function and in "logout" page
exports.getIndex = (req, res, next) => {
  Product.find()
  .then(products => {
    res.render("shop/index", {
      pageTitle: "Shop",
      prods: products,
      path: "/",
      isAuthenticated: req.session.isLoggedIn,
      // "csrfToken()" function will be automatically attached to request when req passes over csrf middleware
      csrfToken: req.csrfToken()
    });
    // thus, once we pass csrf token. then we can do any non-get request from index page provided that html tag is taking csrf value.
    // views/includes/navigation
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
      isAuthenticated: req.session.isLoggedIn
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
        isAuthenticated: req.session.isLoggedIn
      }
    );
  })
  .catch(err => console.log(err));
};


exports.getCart = (req, res, next) => {
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
      isAuthenticated: req.session.isLoggedIn
    });
  })
  .catch(err => {
    console.log(err);
  });
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
  Order.find({'user.userId': req.user._id})
  .then(orders => {
    // console.log(orders);
    res.render('shop/orders', {
      pageTitle: 'Orders',
      path: '/orders',
      orders: orders,
      isAuthenticated: req.session.isLoggedIn
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








