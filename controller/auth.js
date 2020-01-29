const User = require('../model/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isLoggedIn: req.session.isLoggedIn
  });
};

exports.postLogin = (req, res, next) => {
  User.findById('5e2f196a2822d66dbc7f072d')
  .then(user => {
    req.session.user = user;
    req.session.isLoggedIn = true;
    res.redirect('/');
  })
  .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  // console.log('logout');
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  })
};
