exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    // as we have done in path for '404'page, we have to pass 'isLoggedIn' attribute to each ejs page, so that they can get to know user is logged In or not.

    // note: here "req.isLoggedIn = undefined" ie false. this is becasue, req.isLoggedIn is not set till the time it doest go "postLogin"
    // setting up this attributes to all other pages 
    isLoggedIn: req.isLoggedIn
  });
};

// here we are dummy authentication ie without checking email and password, we are redirecting it to home page thinking email amd apssword are correct. hece, dummy authentication.
exports.postLogin = (req, res, next) => {
  // now, after user is logged in , we have to store that information. 
  // one way to store and that info is avaliable to other pages is to put it in request object as attribute
  req.isLoggedIn= true;
  // thus, we craeted an attribute which is 'isLoggedIn' marked as true. but to we dont specify to other pages, it will be marked as 'undefined' ie false. hece till the time user dont login, 'isLoggedIn' will be false and once he did a login 'isLoggedIn' will true.
  
  // after user is loggedIn we have to highlight 'Add Products' and 'Admin Products'
  res.redirect('/');
};

// after setting up all the things, those 2 links didint get highlighted. WHY?
// req.isLoggedIn = undefined. HOW?
// once the response have been sent, request will die off and new req will be genererted. so as soon as page is redirected, req object will not have any addational info which we attached to it.
// thus, storing info in the request is not a good idea. 
// as every request is treated indivdual. this is not accidental but intentially. this is becasue req should not look other req data. then it doesnt matter if taht req is comming from same IP.
// go to app to explain
