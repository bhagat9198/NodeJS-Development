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

  // Product.fetchAll()
  // .then(([rows, fieldsData]) => {
  //   console.log(rows);
  //   res.render("shop/product-list", {
  //     pageTitle: "Shop Products",
  //     prods: rows,
  //     path: "/products"
  //   });
  // })
  // .catch(err => console.log(err));
};

exports.getDetails = (req, res, next) => {
  const productID = req.params.productId;
  // Product.findById(productID, product => {
  //   res.render('shop/product-detail', { pageTitle: product.title, product: product, path: '/products' });
  // });

  Product.findById(productID)
  .then(([product]) => {
    console.log(product);
    res.render(
      'shop/product-detail',
      { pageTitle: product.title,
        product: product[0], 
        path: '/products' 
      }
    );
  })
  .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      for(product of products) {
        const CartproductData = cart.products.find(prod => prod.id === product.id)
        if(CartproductData) {
          cartProducts.push({productData: product, qty: CartproductData.qty});
        }
      }
      res.render('shop/cart', {
        pageTitle: 'Cart',
        path: '/cart',
        products: cartProducts
      });
    });     
  }); 
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
  // "findAll()" is inbuild mathod in sequelise which gives all the data which is stored in model
  // we can restrict elements which are retrived by giving conditions
  // EG:
  // Product.findAll({where: <condition>})
  // thus, findAll can accepts number of arugumets within it.

  Product.findAll()
  .then(products => {
    res.render("shop/index", {
      pageTitle: "Shop",
      prods: products,
      path: "/"
    });
  })
  .catch(err => console.log(err));
  
  // as there is no "fetchAll()", this will not run
  // Product.fetchAll()
  // .then(([rows]) => {
  //   res.render("shop/index", {
  //     pageTitle: "Shop",
  //     prods: rows,
  //     path: "/"
  //   });
  // })
  // .catch (err => console.log(err));
};





