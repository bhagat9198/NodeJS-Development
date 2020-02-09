const http = require('http');

const server = http.createServer((req, res) => {
    console.log(req.url, req.method, req.headers);

    // sending responses
    // we cant write all html data within "write()" as it take small chuck of data at a time.
    res.write('<html>');
    res.write('<head><title>My App</title></head>');
    res.write('<body><h1>Hello World</h1></body>');
    res.write('</html>');
    // to tell the server that we have finished writing our response. else server will keep waiting for more response
    res.end();

});

server.listen(3000);

