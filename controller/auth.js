// requring bycrypt
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
      return res.redirect('/signup')
    }
    // we are having huge security flow, ie storing the password in plain text
    // thus, to hash it. we are using bcrypt package.
    // using bcrypt
    // brcypt has many method. hash() takes 2 argument, 1st: string to be hashed 2nd: number of times or string with which it has to be hashed
    // bcrypt.hash(password, 6)
    // '12' times is considered as good security. more the hashing, more time it will take. 
    // it will give out hashed password which cant be decrypted back.
    // its happens asynchronusly thus, it returns the promise. and once hashing is done, in promise we can store out user data. 
    
    return bcrypt.hash(password,6)
  })
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
  .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
