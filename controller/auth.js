const User = require('../model/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isLoggedIn: req.session.isLoggedIn
  });
};

// after logging in, we can see that all view didnt uplaod (navbar icons) which will show up only after logging in. thus, we have to refresh the page to load all the icons.
exports.postLogin = (req, res, next) => {
  User.findById('5e2f196a2822d66dbc7f072d')
  .then(user => {
    // reason for this is that, 
    // when we do postlogin, we do set our session and when we redirect, the session middleware created that session. ie, it writes into mongodb as we are using mongodb session store and it sets the cookie.
    // so writing the data to mongodb, can take some time(millseconds) but redirect if fired in independent of that, so redirect can happen before cookie is set.
    req.session.user = user;
    req.session.isLoggedIn = true;

    // thus, to be sure that redirect happens once the session is set, we can use save method
    req.session.save(err => {
      if(!err) {
        // if no errors, redirect the page
        res.redirect('/');
      }
    })
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
