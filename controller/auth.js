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

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if(err) {
      console.log(err);
      return res.redirect('/reset')
    }
    const token = buffer.toString('hex');
    User.findOne({email: req.body.email})
    .then(user => {
      if(!user) {
        // displaying flash message
        req.flash('error', 'Invalid Email');
        return res.redirect('/reset');
      }
      user.resetToken = token;
      user.resetTokenExpire = Date.now() + 3600000; 

      return user.save();
    })
    .then(result => {
      req.flash('error', 'Check your email!!!');
      res.redirect('/reset');
      const data = {
        from: 'node@node.com',
        // entering the email
        to: req.body.email,
        subject: 'Reset Password',
        // changing 'text' -> 'html'
        html: `
          <p>You requested for password reset. </p>
          <p> Your link for password reset is <a href="http://localhost:3000/reset/${token}"><b>this</b></a></p>
          `
      };

      api.mg.messages().send(data, function (error, body) {
        console.log('Password Reset Email Body');
        console.log(body);
      });  
    })
    .catch(err => console.log(err));
  })
}

// setting 
module.exports.getNewPassword = (req, res, next) => {

  // getting token from the url
  const token = req.params.token;
  // before rendering the get page, we have to check if the token which is receive is valid or not.
  // if token is valid, we have to check if it not expire. if both the conditions are met, page should be rendered. hence all logic within this function

  // as no user is logged in and nor we dont which user wants to reset the password. hence we will check all th users by the 'resetToken' field. 'resetToken' to equal to 'token' which is in params
  // "$gt" means 'greater than'. it means that 'resetTokenExpire' date should be greater than current date ie "Date.now()"
  User.findOne({resetToken: token, resetTokenExpire: {$gt: Date.now()}})
  // if both the conditions are true
  .then(user => {
    // now we will get that one user info

    // displaying flash if we get
    let message = req.flash('error');
    if(message.length > 0) {
      message = message[0];
      console.log(message);
    } else {
      message = null;
    }
    
    res.render('auth/new-password', {
      path: '/new-password',
      pageTitle: 'New Password',
      errorMessage: message,
      // passing userId in agruments as it will help in post request
      userId: user._id.toString()
    });
  })
  .catch(err => console.log(err));
}