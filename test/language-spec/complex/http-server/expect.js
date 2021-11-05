// Example of a HTTP Server
var http = require('http');

http.createServer(function(req, res) {
        req.writeHead(200, {
            'Content-Type': 'text/plain'
        });

        req.end('so hello\nmuch world');
    })
    .listen(8080);
