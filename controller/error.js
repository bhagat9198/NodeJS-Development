exports.get404 = (req, res, next) => {
  res.status(404);
  res.setHeader('Content-type', 'text/html');
  res.render('404', { pageTitle: "404", path: 'Error' });
};