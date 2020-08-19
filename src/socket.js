const fs = require('fs');
const parser = require("./utils/headersParser");

class Socket {
    constructor(base) {
        this.sock = base;
        this.request = null;

        this.postListeners = {};
        this.getListeners = {};
        this.middlewares = [data => data];

        this.responseHeader = [['Content-Type', 'text/html']];
        this.responseCode = 200;
        this.responseText = 'Ok';
        this.sock.on('data', data => {
            this.request = parser(data.toString());
            switch(this.request.method) {
                case 'POST':
                    if(this.postListeners[this.request.path]) {
                        this.postListeners[this.request.path](this,
                            this.applyMiddlewares(this.request)
                        );
                    } else {
                        this.postListeners['/error/404'](this,
                            this.applyMiddlewares(this.request));
                    }
                    break;
                case 'GET':
                    if(this.getListeners[this.request.path]) {
                        this.getListeners[this.request.path](this,
                            this.applyMiddlewares(this.request)
                        );
                    } else {
                        this.getListeners['/error/404'](this,
                            this.applyMiddlewares(this.request));
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

    status(code, text="=Ok") {
        this.responseCode = code;
        this.responseText = text;
    }

    applyMiddlewares(req) {
        let res = req;

        this.middlewares.forEach(middleware => {
            res = middleware(res);
        });

        return res;
    }

    setHeader(key, value) {
        let exists = this.responseHeader.filter(header => header[0] === key);
        if(exists.length > 0) {
            this.responseHeader[this.responseHeader.indexOf(exists)] = value;
        } else {
            this.responseHeader.push([key, value]);
        }
    }

    send(data) {
        let response = `HTTP/1.1 ${this.responseCode} ${this.responseText}\n`;
        for(let header of this.responseHeader) {
            response += `${header[0]}: ${header[1]}\n`;
        }
        response += `\n${data}`;

        this.sock.write(response);
        this.sock.end();
    }

    sendFile(file) {
        fs.readFile(file, (err, content) => {
            let response = `HTTP/1.1 ${this.responseCode} ${this.responseText}\n`;
            if(err) {
                let response = `HTTP/1.1 500 Internal error.\n`;
                response += `Content-Type: text/html\n`;
                response += `\nError 500 Internal error.`;
                this.sock.write(response);
                return this.sock.end();
            }
            
            for(let header of this.responseHeader) {
                response += `${header[0]}: ${header[1]}\n`;
            }
            response += `\n${content}`;
            this.sock.write(response);
            this.sock.end();
        })
    }
}

module.exports = Socket;