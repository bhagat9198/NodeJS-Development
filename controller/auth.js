exports.getLogin = (req, res, next) => {
  const isLoggedIn = req.get('cookie')
  .trim()
  .split('=')[1] === 'true';
  console.log(isLoggedIn);
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isLoggedIn: isLoggedIn
  });
};
// to track down users, cookies are used. why?
// cookie dont have relate to our page. a cookie can sent to be another page and that is the common instrument in tracking where we have that 'tracking pixel' on the pages which is simply a image url with no real image but that image can be located. lets say on google servers and you that cookie in that page which is also sent along with that and therefore, google can track on which page we are in and how are we moving through the web evein if we are not on their website. as some data is stored in client and it sis ent with every request user makes
// so without being on their server, google can track easlily. thus this can be intersenting in tracking down users.



exports.postLogin = (req, res, next) => {
  // we can configure the cookies, not only with cookie value biyt other things too.
  // we can set multiple cookie
  // res.cookie('first','yes')
  // res.cookie('second','yes1')

  // Expires: its expects some date (date will be in httpDate formate) after which cookie will expire. if we dont set this then cookie will expire as soon as we close the browser
  // res.setHeader('Set-Cookie', 'loggedIn=true; Expires=httpDate);
  
  // alternatively to 'Expires', we can set 'Max-Age'. parameter passed to it in number which represent seconds. in our case, cookie will stay for 10 seconds and then die off.
  // res.setHeader('Set-Cookie', 'loggedIn=true; Max-Age=10');

  // we can set the domain to the cookie. it will tell which website, pur cookie should go
  // res.setHeader('Set-Cookie', 'loggedIn=true; Domain=domainName');

  // secure: this means that this cookie will only be set if the page is servered via HTTPS
  // res.setHeader('Set-Cookie', 'loggedIn=true; Secure');

  // HttpOnly: once it is set, there will be checkmark in 'http' column. this means that we cant access the cookie value through client side JS ie scripts running the brower. 
  // this can be important security mechanism because it protects us from XSS(cross side scripting) attacks . as now our client side JS where someone can inject malicious code cant read the cookie values. this can be important at time of authentican at that time cookie will help in authentication of user.
  // hence, it can be extra security layer. as cookie will still be attach to every request but its value cant be read from inside JS code 
  // res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly');

  // but we will be not setting our cookies, we will take help of 3 party packages which will manage our cookies.

  res.setHeader('Set-Cookie', 'loggedIn=true');
  
  req.isLoggedIn = true;
  res.redirect('/');
};

