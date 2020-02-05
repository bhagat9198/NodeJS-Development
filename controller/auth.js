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

module.exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({resetToken: token, resetTokenExpire: {$gt: Date.now()}})
  .then(user => {
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
      userId: user._id.toString(),
      // needed for postNewPassword
      passwordToken: token
    });
  })
  .catch(err => console.log(err));
}


module.exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  // we need token now also because otherwise people could start entering random tokens in url and still reach to password reset page and then reset users passwords and ids by changing id's in hidden field.
  const passwordToken = req.body.passwordToken;

  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpire: {$gt : Date.now()},
    _id: userId
  })
  .then(user => {
    // once all the conditions are matched, we have to store the password.
    // password should be stored in hashed format
    resetUser = user;

    return bcrypt.hash(newPassword, 12);
  })
  .then(hashedPassword => {
    // once the password is encrypted, it should be stored.
    // to store the password, we should have access to user model of that particular user but its scope is not in this "then" block. hence, using above model

    // "resetUser" have particular info.
    resetUser.password = hashedPassword;
    // as password is updated, making the token and expire time null.
    resetUser.resetToken = undefined;
    resetUser.resetTokenExpire = undefined;
    // saving the password.
    return resetUser.save();
  })
  .then(result => {
    // once password saved successfully.
    res.redirect('/login');
  })
  .catch(err => console.log(err));
}


