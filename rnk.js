const https = require('https');
let last = null;
let interval;

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
const doWork = prev =>
    getLast()
        .then(value => calculate(prev, value))
        .then(result => result || prev);


module.exports = {
    start: (timeout = 3000) => {
        interval = setInterval(() => doWork(last).then(v => last = v), timeout);
        doWork(last).then(v => last = v);
    },
    stop: () => {
        if (!interval) return;
        clearInterval(interval);
        interval = null;
    },
    get blocked() { return last; },
    format: (value) => `Currently blocked: ${value.y}${value.diff ? `, diff: ${getSign(value.diff)}${value.diff}` : ''}`
};
