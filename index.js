const TeleBot = require('telebot');
const config = require('./config');
const rkn = require('./rnk');

const bot = new TeleBot({ token: config.token });
bot.on('/start', msg => msg.reply.text('Hello!'));
bot.on('/blocked', msg => msg.reply.text(rkn.format(rkn.blocked)));

bot.start();
rkn.start();
