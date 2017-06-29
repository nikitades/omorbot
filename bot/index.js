const token = require('../config').token;
const TeleBot = require('telebot');
const bot = new TeleBot(token);

module.exports = bot;