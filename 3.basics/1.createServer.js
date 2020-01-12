const http = require('http');

const server = http.createServer((req,res) => {
  // console.log(req);
  console.log(req.httpVersion);

  
  

  res.setHeader('content-type','text/html');
  // write() works in chunks
  res.write('<html><head><title>My first App</title><head><body><h1>Hello World</h1></body></html>');
  res.end();


  // res.write('<html>');
  // res.write('<head><title>My first App</title><head>');
  // res.write('<body>Hello World</body>');
  // res.write('</html>');
  // res.end();

  // console.log(res);


  // ending the event loop
  // process.exit();
});

server.listen(3000);

