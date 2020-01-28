exports.getLogin = (req, res, next) => {
  const isLoggedIn = req.get('cookie')
  .trim()
  .split('=')[1] === 'true';
  console.log(isLoggedIn);
  // true or flase based on cookie value

  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isLoggedIn: isLoggedIn
  });
};

// we have set up the cookie, but user can change the cookie value from the browser. so this is the major drawback of setting up cookie like this.
// thus, although it is advantage to store some data inside the client browser but we cant store sensitive data inside client browser.
// hence, to prevent thiswe will be taking help of sessions.

exports.postLogin = (req, res, next) => {
  res.setHeader('Set-Cookie', 'loggedIn=true');
  req.isLoggedIn = true;
  res.redirect('/');
};

