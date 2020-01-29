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
    // what happened here?
    // it will stored in session as user object. and it is just the data of user
    // with every new request, session middleware does not go ahead and fetch the user with the help of mongoose. it fetch the session data, from mongodb database but for that it uses mongodb 'store' and mongodb store does not know about our mongoose models. 
    // thus, when it fetches, it only fetches data and not the methods which are with models.
    // app.js
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
