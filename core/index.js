const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
const router = new Router();
const Tokenizer = require('./tokenizer');
const tokenizer = new Tokenizer();
const understand = require('./understand');
const config = require('../config');

app.context.channel = config.channel;
app.context.ok = {ok: true};

app.keys = config.secret;

router.get('*', ctx => {
    ctx.body = 'Sorry, the explicit sending is forbidden for the moment.';
});

// router.get('/test', ctx => {
//     let replyMarkup = bot.inlineKeyboard([
//         [
//             bot.inlineButton('callback', {callback: 'this_is_data'}),
//             bot.inlineButton('inline', {inline: 'some query'})
//         ], [
//             bot.inlineButton('url', {url: 'https://telegram.org'})
//         ]
//     ]);
//     bot.sendMessage(ctx.channel, `bibi`, {
//         replyMarkup
//     }).catch(console.log);
// });

router.post('/' + config.token +'/webhook', ctx => {
    console.log(ctx.request);
});

router.post('/me/:token/msg', async ctx => {
    let token = ctx.params.token;
    await require('./prepare')(ctx);
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