const TeleBot = require('telebot');
const config = require('./config');
const Watcher = require('./watcher');

const bot = new TeleBot({ token: config.token });
const watcher = new Watcher(10000);

bot.on('/start', msg => msg.reply.text('Hello!'));
bot.on('/blocked', msg => msg.reply.text(Watcher.format(watcher.getBlocked())));
bot.on('/startwatch', msg => {
    watcher.addOnUpdateCb(msg.chat.id, value => bot.sendMessage(msg.chat.id, Watcher.format(value)));
    msg.reply.text('Start watching. For stop use /stopwatch');
});
bot.on('/stopwatch', msg => {
    watcher.removeOnUpdateCb(msg.chat.id);
    msg.reply.text('No more notifications');
});
bot.on('stop', () => watcher.stop());

bot.start();
watcher.start();
