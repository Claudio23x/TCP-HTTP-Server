const assert = require('assert');
const parser = require('../utils/headersParser');

const sample = `GET / HTTP/1.1
Host: localhost:3000
Connection: keep-alive
Cache-Control: max-age=0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: cross-site
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Accept-Encoding: gzip, deflate, br
Accept-Language: es-419,es;q=0.9
If-None-Match: W/"761-hw+/2ASfejfTFK9IvxCSLQvFUVM"`;

describe('headersParser', function() {
    const res = parser(sample);
    it('Debe devolver un objeto', function() {
        assert.equal(typeof res, 'object');
    });

    it('Debe contener una key method con el metodo de la petición', function() {
        assert.equal(res.method, 'GET');
    });

    it('Debe contener una key host', function() {
        assert.notEqual(res.Host, undefined);
        assert.notEqual(res.Host, null);
    })
});