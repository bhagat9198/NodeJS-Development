const bcrypt = require('bcryptjs');

// requring 3party packages
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');

const User = require('../model/user');

// in this setup we tell nodemailer how our emails will be delivered. as we know, nodejs will not do own its own, we need 3party.
// calling "sendGridTransport()" as function as after executing it will give us configration that nodemailer can use to use sendgrid.
const transporter = nodemailer.createTransport(sendGridTransport({
  auth: {
    // this api key we get it from from our account
    api_key: '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'
    // instead of api key, we can set up out username and password of our sendgrid account.
  }
}));
// once its configure, we can set our mail

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
      // once signup is successful, we can set our mail
      // it takes JS object where we configure our mail
      return transporter.sendMail({
        to: email,
        from: 'nodeApp@nodeApp.com',
        subject: 'First signup mail',
        html: '<h1>DONE</h1>'
      })
      //  it will give us then and catch block, only using catch block to catch the errors 
      .catch(err => console.log(err));

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
