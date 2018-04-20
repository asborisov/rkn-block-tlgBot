const https = require('https');

const getLast = () => new Promise((resolve, reject) => {
    https.get('https://usher2.club/d1_ipblock.json?_=' + (new Date()).getTime(), (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            try {
                resolve(JSON.parse(data).reduce((acc, v) => v.x > acc.ts ? {ts: v.x, value: v.y} : acc, {ts: 0, value: 0}));
            }
            catch (e) {
                reject();
            }
        });
    }).on("error", (err) => {
        reject("Error: " + err.message);
    });
});

module.exports = {
    getLast,
};
