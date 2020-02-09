const fs = require('fs');

const requestHandler = (req, res) => {
  const url = req.url

  if (url === '/') {
    res.write('<html>');
    res.write('<head><title>My first App</title><head>');
    res.write('<body><form action="/message" method="POST"><input type="text" name="msg"><button type="submit">Send</button></form></body>');
    res.write('</html>');
    // 'return' is used so that it goes out of event loop
    return res.end();
  }

  if (req.url === '/message' && req.method === 'POST') {
    const body = [];
    req.on('data', (chunck) => {
    console.log(chunck);
    body.push(chunck)
  });

  // ending the on() method
  return req.on('end', () => {
    // creating a buffer
    const parseBody = Buffer.concat(body).toString();
    console.log(parseBody);
    const message = parseBody.split('=')[1]; // value
    // adding to file synchronusly
    // it is not advisible to write writeFileSync() as it wil block the excecution of other code below it, till the time its not finished.
    // fs.writeFileSync('message.txt',message);
    fs.writeFile('message.txt', message, err => {
      res.statusCode = 302;
      res.setHeader('Location', '/');
      return res.end();
    })
  });
  }

  res.write('<html>');
  res.write('<head><title>My first App</title><head>');
  res.write('<body>Hello World</body>');
  res.write('</html>');
  res.end();

}


// different ways of exporting modules

// module.exports.requestHandler;

module.exports = {
  handler : requestHandler,
  something : 'Some hard coded text'
};

// module.exports.handler = requestHandler;
// module.exports.something = 'Some hard coded text';

// exports.handler = requestHandler;
// exports.something = 'Some hard coded text';