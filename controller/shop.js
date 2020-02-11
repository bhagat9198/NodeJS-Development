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
    });
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};


exports.getProduct = (req, res, next) => {
  Product.find()
  .then(products => {
    res.render("shop/index", {
      pageTitle: "Shop",
      prods: products,
      path: "/products",
    });
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
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
      }
    );
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};


exports.getCart = (req, res, next) => {
  req.user
  .populate('cart.items.productId')
  .execPopulate()
  .then(user => {
    const products = user.cart.items;
    res.render('shop/cart', {
      pageTitle: 'Cart',
      path: '/cart',
      products: products,
    });
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
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
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
}

exports.postCartDeleteProduct = (req, res, next) => {
  const productID = req.body.productId;
  req.user.deleteItemsFromCart(productID)
  .then((result) => {    
    res.redirect('/cart');
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};

exports.getOrders = (req, res, next) => {
  Order.find({'user.userId': req.user._id})
  .then(orders => {
    res.render('shop/orders', {
      pageTitle: 'Orders',
      path: '/orders',
      orders: orders,
    });
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
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
        email: req.user.email,
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
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};








