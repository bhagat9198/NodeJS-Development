const User = require('../model/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isLoggedIn: false
  });
};
// we are having dummy authentication in place. we are able to login but to logout( or remove the cookie), we manually have to delete the cookie from inspect menu.
// thus, after deleting the cookie, we have to again login to get the cookie. and then we get the other functionality of cookie which it gives.
// hence, there is cleaner way of deleting the cookie by hekp of method.

// we are already having login button but not logout button.
// implementing logout button : 
exports.postLogin = (req, res, next) => {
  // req.session.isLoggedIn = true;
  // res.redirect('/');

  User.findById('5e2f196a2822d66dbc7f072d')
  .then(user => {
    // adding the user to session
    req.session.user = user;
    req.session.isLoggedIn = true;
    res.redirect('/');
  })
  .catch(err => console.log(err));
};

// once the logout button is pressed, we want to delete the session cookie which we created at the time of login. and it should happen automatically
exports.postLogout = (req, res, next) => {
  console.log('logout');
  // to remove the session
  // "destroy()": its a method provided by the session package. it takes a function as argument which will be called once it done destroying the session. 
  // within that internal function, we will not be able to use sesiion package we it has been deleted. but we can recreated it for next request
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  })
};
// thus, once logout function is called, session which was created into the database will be deleted. but in inspect elements, cokkie will be there but its of no use as no matching session will be found. it will just gets renewed once we do login again or it will get deleted once broswer is closed. 
