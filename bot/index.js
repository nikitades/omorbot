const config = require('../config');
const Telegraf = require('telegraf');
const fs = require('fs');
const core = require('../core');

const bot = new Telegraf(config.token);

bot.on('sticker', ctx => {
    ctx.reply('👍');
});

bot.action(/.+/, require('./callback_handler'));

module.exports = bot;