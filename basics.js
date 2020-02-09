const http = require('http');

// const creatingServer = (req, res) => {
//     console.log(req);
// }

// const server = http.createServer(creatingServer);


const server = http.createServer((req, res) => {
    console.log(req);
});

server.listen(3000);

