const net = require('net');
const parser = require('./utils/headersParser');
const Socket = require('./socket');

class Server {
    constructor() {
        this.server = net.createServer();
        this.middlewares = [data => data];
        this.gets = {'/error/404': sock => {
            sock.status(404, 'Not found');
            sock.send('404 Not found');
        }};
        this.posts = {'/error/404': sock => {
            sock.setHeader('Content-Type', 'application/json');
            sock.status(404, 'Not found');
            sock.send('{"error": "404 Not found"}');
        }};

        this.get = this.get.bind(this);
        this.post = this.post.bind(this);
        this.listen = this.listen.bind(this);

        this.server.on('connection', sock => {
            let client = new Socket(sock);
            client.setGetListener(this.gets);
            client.setPostListener(this.posts);
            client.setMiddlewares(this.middlewares);
        })
    }

    get(path, callback) {
        this.gets[path] = callback;
    }

    post(path, callback) {
        this.posts[path] = callback;
    }

    listen(port, host, callback) {
        this.server.listen(port, host, callback);
    }
}

module.exports = Server;