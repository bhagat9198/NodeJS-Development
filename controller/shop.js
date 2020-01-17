const Product = require('../model/product');
const Cart = require('../model/cart');

exports.getProduct = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      pageTitle: "Shop Products",
      prods: products,
      path: "/products"
    });
  })
};

exports.getDetails = (req, res, next) => {
  const productID = req.params.productId;
  // console.log(productID);
  Product.findById(productID, product => {
    res.render('shop/product-detail', { pageTitle: product.title, product: product, path: '/products' });
  });

};

exports.getCart = (req, res, next) => {
  // passing a callback function, once successful, it will get an cart items
  Cart.getCart(cart => {
    // along with the cart, we need product details like title. as cart is only having an product id and quantity.
    // so, to get thr product details
    Product.fetchAll(products => {
      // now from fetchAll method, we will get all the products. if have to find which products are in cart. thus going through all the products
      const cartProducts = [];
      for(product of products) {
        // thus checking if present product is in cart
        // if(cart.products.find(prod => prod.id === product.id)) {
        //   // if the product is in cart, then add it to "cartProduts" array
        //   cartProducts.push(product);
        //   // but along with product details, we need quantity of product too. quantity is strord in cart, hence we need to extract that too.
        // }
        const CartproductData = cart.products.find(prod => prod.id === product.id)
        if(CartproductData) {
          cartProducts.push({productData: product, qty: CartproductData.qty});
          // thus, we have product details and quantity of a product
        }
      }
      res.render('shop/cart', {
        pageTitle: 'Cart',
        path: '/cart',
        // cartProducts is an array which is having both product details and porduct quantity
        products: cartProducts
      });
    }); 
    
  });
  
};

exports.postCart = (req, res, next) => {
  // as request was "POST", so it contains the productID as agrument within the url of "form" 
  // "productID" is the name given to the value ID, in the form field.
  const productID = req.body.productID
  console.log(productID);
  Product.findById(productID, product => {
    Cart.addProduct(productID, product.price);
  })
  res.redirect('/');
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    pageTitle: 'Orders',
    path: '/orders'
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      pageTitle: "Shop",
      prods: products,
      path: "/"
    });
  })
};



