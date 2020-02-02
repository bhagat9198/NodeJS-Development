const bcrypt = require('bcryptjs');
// requring
const mailgun = require("mailgun-js");

const User = require('../model/user');

// hint: only write the domain name, no need to write whole url which is provided by mailgun
// "https://api.mailgun.net/v3/sandboxa1ff2659fff04877819942182d01de45.mailgun.org" => "sandboxa1ff2659fff04877819942182d01de45.mailgun.org"
const DOMAIN = 'sandboxa1ff2659fff04877819942182d01de45.mailgun.org';
// api key provided by mailgun
const mg = mailgun({apiKey: '3e1a6927f22da77a66fa85afe053ca3e-074fa10c-95f80510', domain: DOMAIN});

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if(message.length > 0) {
    message = message[0];
    console.log(message);
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  // console.log(message);
  
  if(message.length > 0) {
    message = message[0];
    console.log(message);
  } else {
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
    req.flash('error','Email or Password is incorrect!!');
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
        req.flash('error','Email or Password is incorrect!!');
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
      req.flash('error','Email all ready exists. Please take another one');
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
      // setting up mail content
      const data = {
        from: 'node@node.com',
        to: email,
        subject: 'Mailgun Email',
        text: 'Successful Signup!!'
      };
      // sendimg the message
      mg.messages().send(data, function (error, body) {
        console.log('Email Body');
        console.log(body);
      });
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


