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

  // so that both the variables be accessed by all the methods within the function
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
        // we have to get the old quantity value 
        // ... code(afterwards)
        // as "cartItem" is intermidiate tabel, sequelize gives us option to use it

        // reason for commint: this will give correct result but we want to avoid nested ".then()" then we can do it another way

        // const oldQunatity = product.cartItem.quantity;
        // newQuantity = oldQunatity + 1;
        // return fetchedCart.addProduct(product, { through: { quantity: newQuantity } })
        // .then(() => {
        //   res.redirect('/cart');
        // })

        // but, id product is alreadythere then, pass the new qunatity
        const oldQunatity = product.cartItem.quantity;
        newQuantity = oldQunatity + 1;
        // atlast returning the product which already exists
        return product;
      }
      return Product.findByPk(productID)
      //no need as below .then() block is expecting product data which will add it to cart 
        // .then(product => {
        //   return fetchedCart.addProduct(product, { through: { quantity: newQuantity } });
        // })
        // .catch(err => console.log(err));
    })
    // above will give us product data (new or already exsisted)
    .then(product => {
      return fetchedCart.addProduct(product, { through: { quantity: newQuantity } });
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
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





