const fs = require('fs');
const bot = require('../bot');
const Extra = require('telegraf').Extra;
const path = require('path');

let general_extra = Extra
    .markdown()
    .markup((m) => m.inlineKeyboard([
        m.callbackButton('Привет)))', 'answer:1'),
        m.callbackButton('Я занята', 'answer:2'),
        m.callbackButton(')))))))', 'answer:3'),
    ], {columns: 3}));

module.exports = ctx => {
    switch (typeof ctx.request.body.attachment) {
        case 'undefined':
            bot.telegram.sendMessage(ctx.channel, `_${ctx.request.body.author}_ \`says\`: *_${ctx.request.body.msg}_* at \`${new Date().toTimeString()}\``, general_extra).catch(console.log);
            break;
        case 'object':
            switch (ctx.request.body.attachment.type) {
                case 'image':
                    if ('url' in ctx.request.body.attachment) {
                        bot.telegram.sendPhoto(
                            ctx.channel,
                            {url: ctx.request.body.attachment.url},
                            Object.assign({
                                caption: `${ctx.request.body.author} says: ${ctx.request.body.msg}`
                            }, general_extra)
                        ).catch(console.log);
                        return {ok: true};
                    }
                    else if ('attachment[content]' in ctx.request.body) {
                        bot.telegram.sendPhoto(
                            ctx.channel,
                            {source: fs.readFileSync(ctx.request.body['attachment[content]'].path)},
                            Object.assign({
                                caption: `${ctx.request.body.author} says: ${ctx.request.body.msg}`
                            }, general_extra)
                        ).catch(console.log);
                        return {ok: true};
                    }
                    break;
                default:
                    return 'Warning! The attachment type mismatch';
                    break;
            }
            break;
    }
    return ctx.ok;
};