const http = require('http');

const server = http.createServer((req, res) => {
    console.log(req.url, req.method, req.headers);
    // terminating the manually. "process" is global keyword
    process.exit();
});

server.listen(3000);

