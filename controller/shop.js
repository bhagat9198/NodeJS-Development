const Product = require('../model/product');
const Cart = require('../model/cart');

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
  Product.findAll({where : 
    {id: productID}
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

  // we want to use the cart which is associated with the existing user to get all the products in it and render it to screen
  // console.log(req.user.cart); //undefined
  // thus, we cant access the cart like this
  
  // but we can get the cart, using the sequelize function
  // req.user.getCart()
  // .then((cart) => {
  //   console.log(cart); //null
    // thus, now we can access. but we dont have any cart with the user. hence 'null'
    // creating the cart for the user in app.js
    // thus, after creating the cart, we cab see some output in console by re-running same command

    // after getting the cart, we have to get the products and display it
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
  // thus, it wil display "no products" as user has not added any products in cart.
  // but, after adding products also, we will get same output.
  

  // Cart.getCart(cart => {
  //   Product.fetchAll(products => {
  //     const cartProducts = [];
  //     for(product of products) {
  //       const CartproductData = cart.products.find(prod => prod.id === product.id)
  //       if(CartproductData) {
  //         cartProducts.push({productData: product, qty: CartproductData.qty});
  //       }
  //     }
  //     res.render('shop/cart', {
  //       pageTitle: 'Cart',
  //       path: '/cart',
  //       products: cartProducts
  //     });
  //   });     
  // }); 
};

exports.postCart = (req, res, next) => {
  const productID = req.body.productID
  console.log(productID);
  Product.findById(productID, product => {
    Cart.addProduct(productID, product.price);
  })
  res.redirect('/');
}

exports.postCartDeleteProduct = (req, res, next) => {
  const productID = req.body.productID;
  Product.findById(productID, product => {
    Cart.deleteProduct(productID, product.price);
    res.redirect('/cart');
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    pageTitle: 'Orders',
    path: '/orders'
  });
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





