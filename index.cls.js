const https = require('https');
let prev = null;
const getLast = () => new Promise((resolve, reject) => {
    https.get('https://usher2.club/d1_ipblock.json?_=' + (new Date()).getTime(), (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            resolve(JSON.parse(data).reduce((acc, v) => v.x > acc.x ? v : acc, {x: 0, y: 0}));
        });
    }).on("error", (err) => {
        reject("Error: " + err.message);
    });
});
const calculate = (prev, next) => {
    if (!prev) return Object.assign({}, next, {diff: 0});
    if (prev.x === next.x) return null;
    return Object.assign({}, next, {diff: next.y - prev.y});
};
const color = (diff) => {
    if (diff > 0) return '\x1b[36m%s\x1b[0m';
    if (diff < 0) return '\x1b[31m%s\x1b[0m';
    return '%s';
};
const getSign = value => value ? (value > 0 ? '+' : '-') : '';
const log = value => {
    if (value) {
        console.log(color(value.diff), `Currently blocked: ${value.y}${value.diff ? `, diff: ${getSign(value.diff)}${value.diff}` : ''}`);
    }
    return value;
};
const doWork = prev =>
    getLast()
        .then(value => calculate(prev, value))
        .then(log)
        .then(result => result || prev);
setInterval(() => doWork(prev).then(v => prev = v), 3000);
doWork(prev).then(v => prev = v);
