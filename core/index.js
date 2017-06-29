const Koa = require('koa');
const Router = require('koa-router');
const busboy = require('async-busboy');
const app = new Koa();
const router = new Router();
const Tokenizer = require('./tokenizer');
const tokenizer = new Tokenizer();
const understand = require('./understand');

// app.context.channel = '@bot_honeypot';
app.context.channel = '@supatest';
app.context.ok = {ok: true};

app.keys = ['im a newer secret', 'i like turtle'];

// router.get('*', ctx => {
//     ctx.body = 'Sorry, the explicit sending is forbidden for the moment.';
// });

let prepare = async (ctx) => {
    let {files, fields} = await busboy(ctx.req);
    ctx.request.body = ctx.request.body || {};
    for (let i in fields) {
        ctx.request.body[i] = fields[i];
    }
    for (let i in files) {
        ctx.request.body[files[i].fieldname] = files[i];
    }
};

let bot = require('../bot');
bot.start();
// Inline button callback
bot.on('callbackQuery', msg => {
    // User message alert
    // bot.sendMessage(app.context.channel, `Inline button callback: ${ msg.data }`);
    return bot.answerCallbackQuery(msg.id, `Inline button callback: ${ msg.data }`, {
        text: 'sdasd'
    });
    // return bot.answerCallbackQuery(msg.id, `Inline button callback: ${ msg.data }`, true);
});
router.get('/test', ctx => {
    let replyMarkup = bot.inlineKeyboard([
        [
            bot.inlineButton('callback', {callback: 'this_is_data'}),
            bot.inlineButton('inline', {inline: 'some query'})
        ], [
            bot.inlineButton('url', {url: 'https://telegram.org'})
        ]
    ]);
    bot.sendMessage(ctx.channel, `bibi`, {
        replyMarkup
    }).catch(console.log);
});

router.post('/me/:token/msg', async ctx => {
    let token = ctx.params.token;
    await prepare(ctx);
    switch (true) {
        case !token || !tokenizer.verify(token):
            ctx.body = 'Sorry, the token has been mismatched.';
            break;
        case !('author' in ctx.request.body):
            ctx.body = 'Warning! Parameters mismatch (author)';
            break;
        case !('msg' in ctx.request.body):
            ctx.body = 'Warning! Parameters mismatch (msg)';
            break;
        default:
            ctx.body = understand(ctx);
    }
});

module.exports = {
    app,
    router
};