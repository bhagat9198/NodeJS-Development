const Product = require('../model/product');

// we are not using Cart model directly as we doing it with the help of users. hence no need to import it
// const Cart = require('../model/cart');
// same goes to Order
// const Order = require('../model/order';)

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
  res.render('shop/orders', {
    pageTitle: 'Orders',
    path: '/orders'
  });
};

exports.postOrder = (req, res, next) => {
  // take all the cart items ans move them in to the orders and claer the cart
  req.user.getCart()
  // after getting all teh cart items
  .then(cart => {
    // aftre getting access to cart, we can get access to products
    return cart.getProducts();
  })
  .then(products => {
    // thus we will get all the products details which are in cart
    // same we can check with console.log
    // console.log(products); 
    // console.log(products.cartItem); //undefined

    // now we need our cart model to store all the products which are in cart along eith quantity

    // calling create order to that user
    // it will give us the order, but now we have to asscoiate products to that order
    return req.user.createOrder()
    .then(order => {
      // associating product to the order now
      // there will be different orders and all the orders can have different quantity, thus we to specify correct quantity to each product
      // order.addProducts(products, {through: {quantity: <value>}})
      // hence, we cant do like this. 
      // each product we pass, shoild have speacial key which tells the quantity

      // we can do with help of map function, which takes an array and gives out new array based on argument function
      // "products" as passed by above .then() block which contains all the products in an array
      return order.addProducts(products.map(product => {
        // "orderItem" is the name of the table. name is importatnt   
        // so in this we will pass an object containing quantity of that product
        product.orderItem = {
          // quantity: req.user.cartItem.quantity //not valid
          // product is related to cartItem, so we can get the quantity field
          quantity: product.cartItem.quantity
        }
        // we will get modified product with quantity field
        return product;
      }))
    })
    .catch(err => console.log(err));
  })
  // form internal promises, we will get the final result
  .then(result => {
    res.redirect('/orders');
    // nothing will be displayed as we have not created html page 
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





