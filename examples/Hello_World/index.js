const fs = require('fs').promises;
const Server = require('../../src');

const port = process.env.PORT || 3000;

const sv = new Server();

sv.get('/', sock => {
    sock.sendFile(__dirname + '/views/index.html');
});

sv.listen(port, '127.0.0.1', () => {
    console.log('listening on', port);
});