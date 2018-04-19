const rkn = require('./rkn');

const getSign = value => value ? (value > 0 ? '+' : '-') : '';
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
                .then(next => this.last = next);
        }, this.timeout);
    }

    stop() {
        if (!this.interval) return;
        clearInterval(this.interval);
        this.interval = null;
    }

    addOnUpdateCb(key, cb) {
        this.cbs[key] = cb;
    }

    removeOnUpdateCb(key) {
        delete this.cbs[key];
    }

    getBlocked() {
        return this.last;
    }

    static format(value) {
        return `Currently blocked: ${value.value}${value.diff ? `, diff: ${getSign(value.diff)}${value.diff}` : ''}`;
    }
}

module.exports = Watcher;
