const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  const url = req.url;
  if(url === '/') {
      res.write('<html>');
      res.write('<head><title>My App</title></head>');
      res.write('<body><form method="POST" action="/message">');
      res.write('<input type="text" name="box">')
      res.write('<button type="submit">Add Item</button>');
      res.write('</form></body>');
      res.write('<html>');
      // res.end();
      return res.end();
  }

  if(url === '/message' && req.method === 'POST') {
    const body =[];
    req.on('data', (chunk) => {
        console.log(chunk);
        // <Buffer 62 6f 78 3d 68 65 6c 6c 6f>
        body.push(chunk);
    });
    req.on('end', () => {
        const parsedBody = Buffer.concat(body).toString();
        console.log(parsedBody); 
        // box=hello
        const message = parsedBody.split('=')[1];
        fs.writeFileSync('message.txt', message);
    })
    res.statusCode = 302; 
    res.setHeader('Content-Type','text/html');
    res.setHeader('Location','/');
    return res.end();
  }

  res.write('<html>');
  res.write('<head><title>My App</title></head>');
  res.write('<body><h1>Hello from NodeJs</h1></body>');
  res.write('</html>');
  res.end();

});

server.listen(3000);

