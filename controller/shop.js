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
  const productID = req.body.productID

  let fetchedCart;

  // to add the cart, we have to modify this function
  // getting the cart
  req.user.getCart()
    .then(cart => {
      fetchedCart = cart;
      // once we fetched the cart, we have to check if that product is alraedy in the cart. 
      // if cart is already there then just increase the quantity
      // else add the new product to the cart
      return cart.getProducts({ where: { id: productID } });
    })
    // getting the products array which are in cart
    .then(products => {
      let product;
      if (products.length > 0) {
        // if product alraedy exists, then taking the product at 0th index
        product = products[0];
      }
      let newQuantity = 1;

      // if product is there already
      if (product) {
        // we have to get the old quantity value 
        // ... code(afterwards)
      }

      // if product does not exists before
      // finding the product info which is stored in db
      return Product.findByPk(productID)
        // doing nested promises
        .then(product => {
          // once we get the product, we can add it to cart
          // "addProduct()" is again the inbuild command of sequelize
          // "product" which was retrived
          // 2nd argument(extra): as in "cart-item" we have quantity field, so we have to specify the value.
            //thus, passing object to object 
          return fetchedCart.addProduct(product, { through: { quantity: newQuantity } });
          // check the database
        })
        .catch(err => console.log(err));
    })
    // once the product has been added, redirecting the page
    .then(() => {
      // this wil gives us an error regarding html page layouts
      res.redirect('/cart');
    })
    .catch(err => console.log(err));


  // console.log(productID);
  // Product.findById(productID, product => {
  //   Cart.addProduct(productID, product.price);
  // })
  // res.redirect('/');
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





