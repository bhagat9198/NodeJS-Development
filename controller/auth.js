const User = require('../model/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  User.findById('5e2f196a2822d66dbc7f072d')
    .then(user => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save(err => {
        console.log(err);
        res.redirect('/');
      });
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  // to create teh user, we will be checking if emial is dupliacte of not.
  // to check this, we ca do it in 2 ways:-
  // 1st: when using mongodb, we can create an index in the mongo databaseon the 'email' field and give that index a unique property. this can be done if you know, how mongodb works.
  // 2nd: try to find the user with that email.
  User.findOne({email: email})
  .then(userData => {
    if(userData) {
      // thus, email already exists
      return res.redirect('/signup')
    }
    // if email doesnt exisits, store the user in database
    const user = new User({
      email: email,
      password: password,
      cart: {items: []}
    })
    // object is created, now saving
    return user.save();
  })
  .then(() => {
    // once user is successfully saved
    res.redirect('/login');
  })
  .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
