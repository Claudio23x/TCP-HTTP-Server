function parser(str) {
    let arr = str.split('\n');
    let res = {};
    arr.forEach((line, index) => {
        if(index !== 0 && index !== arr.length - 1) {
            let aux = line.split(': ');
            res[aux[0]] = aux[1];
            return res;
        } else if(index === 0) {
            let aux = line.split(' ');
            if(aux.length === 2) {
                res.method = aux[0];
                res.path = '/';
                res.protocol = aux[1];
            } else if(aux.length === 3) {
                res.method = aux[0];
                res.path = aux[1];
                res.protocol = aux[2];
            }
        }
    });
    return res;
}

module.exports = parser;