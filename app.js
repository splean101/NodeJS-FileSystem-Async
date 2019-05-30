const fs = require('fs');
//node app.js greeting.txt text1.txt text2.txt text3.txt text4.txt

let [, , pathRes, ...rest] = process.argv;
//sync version
/*for (let key of rest) {
    fs.appendFileSync(pathRes, fs.readFileSync(key, 'utf8') + '\n', 'utf8');
};*/

//async version callback

function read(rest, callback) {
    let data = '';
    let error;
    if (rest.length === 0) error = new Error('array is empty');
    for (let key of rest) {
        fs.readFile(key, 'utf8', (err, res) => {
            if (err) throw err;
            data += res + '\n';
        });
    };
    console.log(data);
    callback(error, data);
};

function write(error, data) {
    if (error) throw error;
    fs.appendFile(pathRes, data, 'utf8', (error) => {
        if (error) throw error;
    });
};

read(rest, write);

//async version Promise
const util = require('util');
const readFileP = util.promisify(fs.readFile);
const appendFileP = util.promisify(fs.appendFile);
const f = new Promise((resolve, reject) => {
    if (rest.length === 0) {
        reject('array is empty')
    } else {
        let data = '';
        for (let key of rest) {
            readFileP(key, 'utf8').then((res) => data += res + '\n');
        };
        resolve(data);
    };
});
f.then((result) => /*appendFileP(pathRes, result, 'utf8')*/
fs.appendFile(pathRes, result, 'utf8', (error) => {
    if (error) throw error;
}));