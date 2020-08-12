const net = require('net');

const ip = '127.0.0.1';
const port = 3000;

const server = net.createServer();

server.on('connection', sock => {
    sock.on('data', data => {
        let response = new Buffer(`HTTP/1.1 200 Ok
Content-Type: text/html

Hola, Mundo!`);
        sock.write(response);
        sock.end();
    })
})

server.listen(port, ip, () => {
    console.log(`Listening on ${ip}:${port}`);
});