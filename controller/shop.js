const Product = require('../model/product');
const Cart = require('../model/cart');

exports.getProduct = (req, res, next) => {
  Product.fetchAll()
  .then(([rows, fieldsData]) => {
    console.log(rows);
    res.render("shop/product-list", {
      pageTitle: "Shop Products",
      prods: rows,
      path: "/products"
    });
  })
  .catch(err => console.log(err));
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
  Product.fetchAll()
  .then(([rows]) => {
    res.render("shop/index", {
      pageTitle: "Shop",
      prods: rows,
      path: "/"
    });
  })
  .catch (err => console.log(err));
};



