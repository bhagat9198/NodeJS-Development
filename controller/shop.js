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

  // getting the cart
  req.user.getCart()
  .then(cart => {
    // after getting the cart, finding the correct item which is to be deleted
    return cart.getProducts({where: {id: productID}})
  })
  .then(products => {
    // "getProducts" will pass an array, on the 0th index. it will contain the product details
    const product = products[0];
    // we only have to delete the product in cartItem table and not product as a whole.
    // this will delete product as a whole, which we dont want
    // return product.destroy() 
    // so, using sequelize property
    return product.cartItem.destroy();
  })
  .then(() => res.redirect('/cart'))
  .catch(err => console.log(err));

  // Product.findById(productID, product => {
  //   Cart.deleteProduct(productID, product.price);
  //   res.redirect('/cart');
  // });
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





