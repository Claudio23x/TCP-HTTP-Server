const fs = require('fs').promises;
const Server = require('./Server');

let sv = new Server();

sv.get('/', sock => {
    fs.readFile(__dirname + '/views/index.html')
        .then(html => {
            sock.send({response: html});
        })
});

sv.listen(3000, '127.0.0.1', () => {
    console.log('listen');
});