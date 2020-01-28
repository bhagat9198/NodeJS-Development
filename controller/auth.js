exports.getLogin = (req, res, next) => {
  // if cookie is get in broswer inseption -> application -> cookies and there we can see the cookie key and value

  // to see, if we are reciving cookie from the server
  // req.get(): will take header name. to find the haeder name inspect -> network -> haeders
  // console.log(req.get('cookie'));
  // output: "loggedIn=true"
  // making use of the cookie

  const isLoggedIn = req.get('cookie')
  // .split(';')[1] // if we are having more then one cookie spliting it and then specifing the index
  .trim()
  .split('=')[1]; //taking ony the value of cookie (loggedIn=true)

  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    // isLoggedIn: req.isLoggedIn
    isLoggedIn: isLoggedIn
  });
};

exports.postLogin = (req, res, next) => {
  // thus, storing data in req is not ideal as req and req data will die of as soon as response is sent.

  // other aletrnative: creating one global file/variable so that it can be shared amoung all the request.
  // this is also not correct, as that file/variable will be shared amoung shared amoung all the req of different users (at last its server). this is also something which we dont want. 

  // thus, thats were cookies will help us. with cookies we can store data in the broswer of a single user and store data in that browser which is customised to that user and does not affect other users

  // setting a cookie. setting cookie is done by setting up header
  // setHeader: it accepts key, value pair
  // 'Set-Cookie': key name
  // 'loggedIn=true' : loggedIn is cookie name and 'true' is assigned to it with help of assignment operator
  res.setHeader('Set-Cookie', 'loggedIn=true');
  // thus, as soon as we set this, cookie will get stored in broswer and with every request it will be sent to server
  req.isLoggedIn = true;
  res.redirect('/');
};

