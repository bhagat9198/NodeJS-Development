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
  // we no loger want to find dummy user, but the user who have entered email amd password on login page
  // User.findById('5e2f196a2822d66dbc7f072d')
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email: email})
    .then(user => {
      // if user with that email is not found
      if(!user) {
        return res.redirect('/login');
      }
      // if user with that email id found, check for the password if it correct or not
      // it will give out promise
      // 1st arg: password to be matched 2nd arg: hashed password with which plain text password should be matched
      bcrypt.compare(password, user.password)
      .then(doMatch => {
        // it will give us true or false value
        // if password got matched
        if(doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save(err => {
            console.log(err);
            res.redirect('/');
          });
        } else {
          return res.redirect('/login');
        }
      })
      // if not able to match the passwords because of some problem, then catch block will be executed
      .catch(err => console.log(err));

    //   req.session.isLoggedIn = true;
    //   req.session.user = user;
    //   req.session.save(err => {
    //     console.log(err);
    //     res.redirect('/');
    //   });
    // })
    // .catch(err => console.log(err));
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
    return bcrypt.hash(password,6)
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
