const http = require('http');

// creting a function
const creatingServer = (req, res) => {
    console.log(req);
}

// calling a function
const server = http.createServer(creatingServer);


const server = http.createServer((req, res) => {
    console.log(req);
});

server.listen(3000);