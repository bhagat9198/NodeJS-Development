const bcrypt = require('bcryptjs');

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
  User.findOne({email: email})
  .then(userData => {
    if(userData) {
      // if we add signing up with exisiting email, we are getting an error. " password: MongooseError [ValidatorError]: Path `password` is required."

      // this is because, our condition is within 'if' block, hence after returning, it movoes to next "then" block where we are storing hashed password.
      // so, instaed of putting then() bloack outside, we will put it within this block. so after return, it should go to catch block if there is any errors.
      return res.redirect('/signup')
    }
    return bcrypt.hash(password,6)
    // nested then blocks
    .then(hashedPassword => {
      const user = new User({
        email: email,
        password: hashedPassword,
        cart: {items: []}
      })
      return user.save();
    })
    .then(() => {
      res.redirect('/login');
    })
  })
  
  .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
