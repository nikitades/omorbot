const token = require('../token');
const TeleBot = require('telebot');
const bot = new TeleBot(token);

module.exports = bot;