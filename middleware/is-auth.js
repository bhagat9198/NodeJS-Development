// basic middleware

module.exports = (req, res, next) => {
  if(!req.session.isLoggedIn) {
    // if user is not logged in, it will it redirected
    return res.redirect('/login');
  }
  // if user is logged in, then it should display the specific page on which user goes.
  // hence, calling the next middleware which is in line.
  next();
}