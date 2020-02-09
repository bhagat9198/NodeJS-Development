const http = require('http');

const server = http.createServer((req, res) => {
    // console.log(req.url, req.method, req.headers);

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

    res.write('<html>');
    res.write('<head><title>My App</title></head>');
    res.write('<body><h1>Hello from NodeJs</h1></body>');
    res.write('</html>');
    res.end();

});

server.listen(3000);

