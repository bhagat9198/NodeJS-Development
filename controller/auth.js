const bcrypt = require('bcryptjs');

// requring crypto
const crypto = require('crypto');

const User = require('../model/user');
const api = require('../private/api');

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
      const data = {
        from: 'node@node.com',
        to: email,
        subject: 'Mailgun Email',
        text: 'Successful Signup!!'
      };

      api.mg.messages().send(data, function (error, body) {
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

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if(message.length > 0) {
    message = message[0];
    console.log(message);
  } else {
    message = null;
  }
  
  res.render('auth/reset', {
    path: '/signup',
    pageTitle: 'Reset Password',
    errorMessage: message
  });
};

// once "reset password" button is clicked 
exports.postReset = (req, res, next) => {
  // generating the token with help to crypto liberary
  // "crypto": this liberary helps us with creating secure, unique, random values
  // "randomBytes(32)": creating 32 random bytes, 
  // 2nd arg: it will call callback function oonce it done 
  // so either we will get error or buffer. 'buffer' is buffer of the bytes 
  crypto.randomBytes(32, (err, buffer) => {
    if(err) {
      console.log(err);
      return res.redirect('/reset')
    }
    // if no error, once the token is generated from that buffer. buffer will be in hexadeciaml form so we have to tell 'toString()' about it by passing 'hex'. thus, we get ascii character from hexadeciamls.
    const token = buffer.toString('hex');
    // once the token is generated, we have to store it in database. and it should get stored on user object because it belongs to that user
    // model/user

    // storing the token on the user, which is reseting the password
    // thus, first finding out the user with help of email
    User.findOne({email: req.body.email})
    .then(user => {
      // if email not found
      if(!user) {
        req.flash('error', 'Invalid Email');
        return res.redirect('/reset');
      }
      // if email found, storing the token
      user.resetToken = token;
      // storing the time, time is set up in milliseconds. hence 1hour -> 3600*1000 = 3600000
      // setting up time of 1 hr from present time
      user.resetTokenExpire = Date.now() + 3600000; 

      // once setting up, saving user db
      return user.save();
    })
    // once the user db is saved
    .then(result => {
      // once the user db is saved, now we can send the email
      // sending the email with the link
      const data = {
        from: 'node@node.com',
        to: email,
        subject: 'Reset Password',
        // usinh ES6 string interpolation feature
        text: `
          <p>You requested for password reset. </p>
          <p> Your link for password reset is <a href="http://localhost:3000/reset/${token}"><b>this</b></a></p>
        `
      };

      api.mg.messages().send(data, function (error, body) {
        console.log('Email Body');
        console.log(body);
      });  
    })
    .catch(err => console.log(err));
  })
}