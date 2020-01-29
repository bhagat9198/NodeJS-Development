exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get('cookie')
  // .trim()
  // .split('=')[1] === 'true';

  console.log(req.session);
  
  console.log(req.session.isLoggedIn);
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isLoggedIn: false
  });
};

// as soon as we go to postLogin route, we will get a cookie "connect.sid" with some long value hashed with the string which we gave when setting up session. 
// thus, now cookie is saved accross request but not across users. as we have seen, for different browsers, differnt cookie value will be stored. 
// all this saving right now taking place in memeory(not in database) thus, cookie will expire as soon as we close our server.

exports.postLogin = (req, res, next) => {
  // res.setHeader('Set-Cookie', 'loggedIn=true');

  // setting up the cookie with help of session
  // once the session middleware is setup, it will attach 'session' object to 'req' object.
  // and to the session object, we can attach any key we want and give it a value
  req.session.isLoggedIn = true;
  res.redirect('/');
};

