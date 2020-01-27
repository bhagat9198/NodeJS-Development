const mongoose = require('mongoose');

const Product = require('../model/product');
const Order = require('../model/order');

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
  req.user
  .populate('cart.items.productId')
  .execPopulate()
  .then(user => {
    const products = user.cart.items;
    // console.log(products);
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

  // req.user.getOrders()
  // .then(orders => {
  //   res.render('shop/orders', {
  //     pageTitle: 'Orders',
  //     path: '/orders',
  //     orders: orders
  //   });
  // })
  // .catch(err => console.log(err));

};

exports.postOrder = (req, res, next) => {
  req.user
  .populate('cart.items.productId')
  .execPopulate()
  .then(user => {
    const products = user.cart.items.map(i => {
      // priviously, "product: i.productId" was giving us only producyId even though we need all product details which were shown in console.log
      // so we created one seprated object where all product details will be stored.
      // ...(spread operator): it will gives out all the data which is within it. atlast productId is an object containing all the data of product
      // _doc property: even though in console.log of productId we cant see other data , but productId will have lot of metadata attach to it which is of no use to us. hence to omit all that unnessary metadata, we are using '_doc' property.
      // works fine
      // return {quantity: i.quantity, product: {...i.productId}};
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
    res.redirect('/cart');
  })
  .catch(err => console.log(err));



  // req.user.addOder()
  // .then(() => {
  //   res.redirect('/');
  // })
  // .catch(err => console.log(err));

};







