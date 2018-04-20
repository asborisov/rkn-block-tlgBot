const rkn = require('./rkn');

const getDiff = (prev, last) => (prev && prev.value && last && last.value) ? (last.value - prev.value) : 0;
const calculateNext = (prev, last) => prev.ts === last.ts ? prev : Object.assign({}, last, {diff: getDiff(prev, last)});

class Watcher {
    constructor(timeout = 30000) {
        this.timeout = timeout;
        this.interval = null;
        this.last = {ts: 0, value: 0, diff: null};
        this.lastNotified = 0;
        this.cbs = {};
    }

    start() {
        if (this.interval) return;
        this.interval = setInterval(() => {
            rkn.getLast()
                .then(value => calculateNext(this.last, value))
                .then(next => {
                    if (this.last.diff !== next.diff && next.ts !== this.lastNotified) {
                        this.lastNotified = next.ts;
                        Object.values(this.cbs).forEach(cb => cb(next));
                    }
                    return next;
                })
                .then(next => this.last = next)
                .catch(e => console.log('Error during response get/parse', e));
        }, this.timeout);
        console.log('Watcher started');
    }

    stop() {
        if (!this.interval) return;
        clearInterval(this.interval);
        this.interval = null;
        console.log('Watcher stopped');
    }

    addOnUpdateCb(key, cb) {
        this.cbs[key] = cb;
        console.log(`Callback for chat ${key} added. Totally in list ${Object.keys(this.cbs).length}`);
    }

    removeOnUpdateCb(key) {
        delete this.cbs[key];
        console.log(`Callback for chat ${key} removed. Totally in list ${Object.keys(this.cbs).length}`);
    }

    getBlocked() {
        return this.last;
    }
}

module.exports = Watcher;
