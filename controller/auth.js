exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get('cookie')
  // .trim()
  // .split('=')[1] === 'true';

  // console.log(req.session);
  // console.log(req.session.isLoggedIn);
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isLoggedIn: false
  });
};

// as we see, cokkie is getting dtored in memmory and memory will quickly gets filled up as soon as we have more user. and secondly, for securiy perspective, its not ideal.
// thus, using database. we can use different databases and files. for more info github/expressjs -> sessions (at bottom)
// go to app.js 
exports.postLogin = (req, res, next) => {
  req.session.isLoggedIn = true;
  res.redirect('/');
};

