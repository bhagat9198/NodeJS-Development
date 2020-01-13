const products = [];

exports.getAddProduct = (req, res, next) => {
  res.render('addProduct', {path: "admin/add-product", pageTitle : 'Add Products', activeAddProduct: true, formsCSS: true, productCSS: true})
};

exports.postAddProduct = (req, res, next) => {
  products.push({'title' : req.body.title});
  console.log('admin.js ', products);
  res.redirect('/');
};

exports.getproduct = (req, res, next) => {
  res.render('shop', {pageTitle: 'Shop', prods : products, path : '/'});
  // console.log('shop.js ', products);
};