const Product = require('../model/product');

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
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
  Product.fetchAll()
    .then(products => {
      res.render("shop/product-list", {
        pageTitle: "Shop Products",
        prods: products,
        path: "/products"
      });
    })
    .catch(err => console.log(err));
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
  

//     req.user.getOrders({include: ['products']})
//     .then(orders => {
//     res.render('shop/orders', {
//       pageTitle: 'Orders',
//       path: '/orders',
//       orders: orders
//     });
//   })
//   .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user.getOder()
  .then(() => {
    res.redirect('/');
  })
  .catch(err => console.log(err));



  // let fetchCart;
  // req.user.getCart()
  // .then(cart => {
  //   fetchCart = cart;
  //   return cart.getProducts();
  // })
  // .then(products => {
  //   return req.user.createOrder()
  //   .then(order => {
  //     return order.addProducts(products.map(product => {
  //       product.orderItem = {
  //         quantity: product.cartItem.quantity
  //       }
  //       return product;
  //     }))
  //   })
  //   .catch(err => console.log(err));
  // })
  // .then(result => {
  //   return fetchCart.setProducts(null);
  // })
  // .then(() => {
  //   res.redirect('/orders');
  // })
  // .catch(err => console.log(err));
};







