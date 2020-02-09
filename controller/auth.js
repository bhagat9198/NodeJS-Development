const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { validationResult } = require('express-validator/check');

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
    errorMessage: message,
    // ---
    oldInput: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationError: []
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
    errorMessage: message,
    oldInput: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationError: []
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email: email})
  .then(user => {
    if(!user) {
      return res.status(422).render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: 'Email or Password is incorrect!!',
        oldInput: {
          email: email,
          password: password
        },
        validationError: [{param: 'email'}]
      });
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
      // ----
      return res.status(422).render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: 'Email or Password is incorrect!!',
        oldInput: {
          email: email,
          password: password
        },
        validationError: [{param: 'email'}]
      });
    }
  })
  .catch(err => console.log(err));
  })
  .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  // console.log(errors.array());
  
  if(!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword
      },
      validationError: errors.array()
    });
  }
  bcrypt.hash(password,6)
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
        to: req.body.email,
        subject: 'Reset Password',
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

module.exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({resetToken: token, resetTokenExpire: {$gt: Date.now()}})
  .then(user => {
    // console.log(user);
    let message = req.flash('error');
    if(message.length > 0) {
      message = message[0];
      console.log(message);
    } else {
      message = null;
    }
    // console.log(user._id.toString());
    res.render('auth/new-password', {
      path: '/new-password',
      pageTitle: 'New Password',
      errorMessage: message,
      userId: user._id.toString(),
      passwordToken: token
    });
  })
  .catch(err => console.log(err));
}


module.exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;

  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpire: {$gt : Date.now()},
    _id: userId
  })
  .then(user => {
    resetUser = user;
    return bcrypt.hash(newPassword, 12);
  })
  .then(hashedPassword => {
    resetUser.password = hashedPassword;
    resetUser.resetToken = undefined;
    resetUser.resetTokenExpire = undefined;
    return resetUser.save();
  })
  .then(result => {
    res.redirect('/login');
  })
  .catch(err => console.log(err));
}


