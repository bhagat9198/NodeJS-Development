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
        // using file system to write down in file
        // fs.writeFile()
        // 1st arg: telling where to write 2nd arg: what to write down in file
        fs.writeFileSync('message.txt', 'Dummy Text');
        res.statusCode = 302; //302 code is for re-directing
        res.setHeader('Content-Type','text/html');
        res.setHeader('Location','/');
        res.write('<h1>Message received</h1>');
        return res.end();
    }

    res.write('<html>');
    res.write('<head><title>My App</title></head>');
    res.write('<body><h1>Hello from NodeJs</h1></body>');
    res.write('</html>');
    res.end();

});

server.listen(3000);

