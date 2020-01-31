const bcrypt = require('bcryptjs');

const User = require('../model/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    
  });
};

// even if we load the signup page, we can see the error red bar at the top.
// thus, it means that 'errorMessage' is not set to undefined even when no error message is passed by flash.
exports.getSignup = (req, res, next) => {
  // console.log(req.flash('error'));  
  // []
  // empty error is passed when no error is passed by flash. hence we can see the red bar at top everytime we load the page.
  // ['Invalid email or password']
  // this will occure when flash() will pop out error.
  // solution:
  let message = req.flash('error');
  console.log(message);
  
  if(message.length > 0) {
    message = message[0];
    // collecting the error at very first index
    console.log(message);
  } else {
    // if no error is there, then making the message null. this is done so that the condition which is there in 'views' will get false and reb bar will not be shown if no error are there.
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email: email})
  .then(user => {
    if(!user) {
      return res.redirect('/login');
    }
    bcrypt.compare(password, user.password)
    .then(doMatch => {
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
    .catch(err => console.log(err));
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
      req.flash('error','Invalid email or password');
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
