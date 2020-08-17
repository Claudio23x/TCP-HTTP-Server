const net = require('net');
const parser = require('./utils/headersParser');
const Socket = require('./socket');

class Server {
    constructor() {
        this.server = net.createServer();
        this.middlewares = [data => data];
        this.gets = {};
        this.posts = {};

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