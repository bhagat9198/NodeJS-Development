const http = require('http');

// // creating a seprate function
// const creatingServer = (req, res) => {
//     console.log(req);
// }

// // calling function from a function
// const server = http.createServer(creatingServer);


const server = http.createServer((req, res) => {
    console.log(req);
});

server.listen(3000);

