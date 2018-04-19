const Watcher = require('./watcher');

const watcher = new Watcher(3000);
const color = (diff) => {
    if (diff > 0) return '\x1b[36m%s\x1b[0m';
    if (diff < 0) return '\x1b[31m%s\x1b[0m';
    return '%s';
};
const log = value => {
    if (!value) return;
    console.log(color(value.diff), Watcher.format(value));
};
watcher.addOnUpdateCb('console', log);
watcher.start();
