const fs = require('fs');
const bot = require('../bot');
module.exports = ctx => {
    switch (typeof ctx.request.body.attachment) {
        case 'undefined':
            bot.sendMessage(ctx.channel, `_${ctx.request.body.author}_ \`says\`: *_${ctx.request.body.msg}_* at \`${new Date().toTimeString()}\``, {
                parseMode: 'Markdown'
            });
            break;
        case 'object':
            switch (ctx.request.body.attachment.type) {
                case 'image':
                    if ('url' in ctx.request.body.attachment) {
                        bot.sendPhoto(ctx.channel, ctx.request.body.attachment.url, {
                            caption: `${ctx.request.body.author} says: ${ctx.request.body.msg}`
                        });
                        return {ok: true};
                    }
                    else if ('attachment[content]' in ctx.request.body) {
                        bot.sendPhoto(ctx.channel, fs.readFileSync(ctx.request.body['attachment[content]'].path), {
                            caption: `${ctx.request.body.author} says: ${ctx.request.body.msg}`
                        });
                        return {ok: true};
                    }
                    break;
                default:
                    return 'Warning! The attachment type mismatch';
                    break;
            }
            break;
    }
    return {ok: true};
};