const bot = require('../bot');
const Chatter = require('./Chatter');
const path = require('path');
const Markup = require('telegraf').Markup;
const Extra = require('telegraf').Extra;
const Conversation = require('./Conversation');
const config = require('../config');

let general_extra = Extra
    .markdown()
    .markup((m) => m.inlineKeyboard([
        m.callbackButton(')))', 'answer:1'),
        m.callbackButton('ты прикольный. расскажи о себе', 'answer:2'),
        m.callbackButton('на мне сейчас одни трусики ;)', 'answer:3'),
    ], {columns: 1}));

module.exports = async ctx => {
    let conversation = await new Conversation(ctx.request.body);
    let chatter = new Chatter({
        conversation: conversation
    });
    await chatter.ready;
    bot.telegram.sendPhoto(
        config.channel,
        {
            source: await chatter.make()
        },
        Object.assign({
            caption: `Выберите ответ:`
        }, general_extra)
    ).catch(console.log);
    return ctx.ok;
};