const Product = require('../model/product');

exports.getProduct = (req, res, next) => {
  Product.findAll()
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
  Product.findAll({
    where:
      { id: productID }
  })
    .then(product => {
      res.render(
        'shop/product-detail',
        {
          pageTitle: product[0].title,
          product: product[0],
          path: '/products'
        }
      );
    })
    .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user.getCart()
    .then(cart => {
      return cart.getProducts()
    })
    .then((products) => {
      res.render('shop/cart', {
        pageTitle: 'Cart',
        path: '/cart',
        products: products
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const productID = req.body.productId
  let fetchedCart;
  let newQuantity = 1;

  req.user.getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productID } });
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      
      if (product) {
        const oldQunatity = product.cartItem.quantity;
        newQuantity = oldQunatity + 1;
        return product;
      }
      return Product.findByPk(productID)
    })
    .then(product => {
      return fetchedCart.addProduct(product, { through: { quantity: newQuantity } });
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
}

exports.postCartDeleteProduct = (req, res, next) => {
  const productID = req.body.productId;

  req.user.getCart()
  .then(cart => {
    return cart.getProducts({where: {id: productID}})
  })
  .then(products => {
    const product = products[0];
    return product.cartItem.destroy();
  })
  .then(() => res.redirect('/cart'))
  .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  // displaying the orders products on the webpage
  // getting the orders first
  // req.user.getOrders()
  // .then(orders => {
  //   console.log(orders);
  //   /****
  //     order {
  //     dataValues: {
  //     id: 4,
  //     createdAt: 2020-01-22T08:15:18.000Z,
  //     updatedAt: 2020-01-22T08:15:18.000Z,
  //     userId: 1
  //   },
  //    */
  //   // thus we can see that there is no orderItem key
  //   res.render('shop/orders', {
  //     pageTitle: 'Orders',
  //     path: '/orders',
  //     // passing orders to web page to display it
  //     orders: orders
  //   });

    // thus, if we want to fetch related products to an order, we have to pass an object. where we set:
    // "products" : in app.js we associate our 'order' to many 'product' && in models, we create our table 'product'. thus sequelise pluralizes this and then we can us e the concept called "eager loading".
    // "eager loading": in this we instruct sequelise that , we are fetching all the orders than fetch all the related products it and give back one array of orders taht also includes the products per order
    // this only works because we have realations between the orders and products as we set up in 'app.js' and so we can load both together
    // still, it will not make our temaplate work, now we get orders with more data in them. each order will have product array. with that, go to views  
    req.user.getOrders({include: ['products']})
    .then(orders => {
    // console.log(orders);
    res.render('shop/orders', {
      pageTitle: 'Orders',
      path: '/orders',
      orders: orders
    });
  })
  .catch(err => console.log(err));


  // res.render('shop/orders', {
  //   pageTitle: 'Orders',
  //   path: '/orders'
  // });
};

exports.postOrder = (req, res, next) => {
  // after products reaches to order page successfully, we have to delete the cart items

  // making global variable with the function
  let fetchCart;

  req.user.getCart()
  .then(cart => {
    // once we get the cart products
    fetchCart = cart;
    return cart.getProducts();
  })
  .then(products => {
    return req.user.createOrder()
    .then(order => {
      return order.addProducts(products.map(product => {
        product.orderItem = {
          quantity: product.cartItem.quantity
        }
        return product;
      }))
    })
    .catch(err => console.log(err));
  })
  .then(result => {
    // once products are stored in order-item table, remove the elment from cart
    // 2nd method, other the destroy()
    return fetchCart.setProducts(null);
    // res.redirect('/orders');
  })
  // when above promise is done
  .then(() => {
    res.redirect('/orders');
  })
  .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render("shop/index", {
        pageTitle: "Shop",
        prods: products,
        path: "/"
      });
    })
    .catch(err => console.log(err));
};





