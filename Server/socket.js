const parser = require("./utils/headersParser");

class Socket {
    constructor(base) {
        this.sock = base;
        this.request = null;

        this.postListeners = {};
        this.getListeners = {};
        this.middlewares = [data => data];

        this.sock.on('data', data => {
            this.request = parser(data.toString());
            switch(this.request.method) {
                case 'POST':
                    if(this.postListeners[this.request.path]) {
                        this.postListeners[this.request.path](this,
                            this.applyMiddlewares(this.request)
                        );
                    } else {
                        this.postListeners['/error/404']();
                    }
                    break;
                case 'GET':
                    if(this.getListeners[this.request.path]) {
                        this.getListeners[this.request.path](this,
                            this.applyMiddlewares(this.request)
                        );
                    } else {
                        this.getListeners['/error/404']();
                    }
                    break;
            }
        })
    }

    setPostListener(listener) {
        this.postListeners = listener;
    }

    setGetListener(listener) {
        this.getListeners = listener;
    }

    setMiddlewares(mids) {
        this.middlewares = mids;
    }

    applyMiddlewares(req) {
        let res = req;

        this.middlewares.forEach(middleware => {
            res = middleware(res);
        });

        return res;
    }

    send(data) {
        this.sock.write(
`HTTP/1.1 ${data.resCode || 200} ${data.resText || 'Ok'}
Content-Type: ${data.contentType || 'text/html'}

${data.response}`
        );
    }
}

module.exports = Socket;