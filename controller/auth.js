exports.getLogin = (req, res, next) => {
  const isLoggedIn = req.get('cookie')
  .trim()
  .split('=')[1] === 'true';
  console.log(isLoggedIn);
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isLoggedIn: isLoggedIn
  });
};


exports.postLogin = (req, res, next) => {
  res.setHeader('Set-Cookie', 'loggedIn=true');
  
  req.isLoggedIn = true;
  res.redirect('/');
};

