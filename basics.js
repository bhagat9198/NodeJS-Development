const http = require('http');
// requring user defined file
const routes = require('./routes');

// assing routes object
console.log(routes.something);

const server = http.createServer(routes.handler);

server.listen(3000);

